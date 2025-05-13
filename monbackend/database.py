from sqlalchemy import Column, Integer, String, Float, Boolean, Date, ForeignKey, create_engine
from sqlalchemy.orm import relationship, sessionmaker, declarative_base

# Connexion PostgreSQL (à adapter selon ton mot de passe)
DATABASE_URL = "postgresql://postgres:anoma11@localhost:5432/anoma"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)
Base = declarative_base()








class Utilisateur(Base):
    __tablename__= "utilisateurs"

    id = Column(Integer, primary_key=True, index=True)
    nom = Column(String)
    email = Column(String, unique=True, index=True)
    motdepasse = Column(String)
    secteur = Column(String)
    photodeprofil = Column(String)
    pseudo = Column(String)

    dataset = relationship("Dataset", back_populates="utilisateur", uselist=False)
    modeles = relationship("Modele", back_populates="utilisateur")


class Dataset(Base):
    __tablename__= "datasets"

    id = Column(Integer, primary_key=True, index=True)
    uniteX = Column(String)
    uniteY = Column(String)
    type = Column(String)

    utilisateur_id = Column(Integer, ForeignKey("utilisateurs.id"))
    utilisateur = relationship("Utilisateur", back_populates="dataset")

    donnees = relationship("Donnee", back_populates="dataset", cascade="all, delete")


class Donnee(Base):
    __tablename__ = "donnees"

    id = Column(Integer, primary_key=True, index=True)
    x = Column(Float)
    y = Column(Float)

    dataset_id = Column(Integer, ForeignKey("datasets.id"))
    dataset = relationship("Dataset", back_populates="donnees")

    modeles = relationship("Modele", secondary="modeles_donnees", back_populates="donnees")


class Modele(Base):
    __tablename__ = "modeles"

    id = Column(Integer, primary_key=True, index=True)
    duree = Column(Float)
    taux_derreur = Column(Float)
    acheter = Column(Boolean)
    datedeprediction = Column(Date)

    utilisateur_id = Column(Integer, ForeignKey("utilisateurs.id"))
    utilisateur = relationship("Utilisateur", back_populates="modeles")

    donnees = relationship("Donnee", secondary="modeles_donnees", back_populates="modeles")

    arima = relationship("Arima", back_populates="modele", cascade="all, delete", uselist=False)
    sarima = relationship("Sarima", back_populates="modele", cascade="all, delete", uselist=False)
    sarimax = relationship("Sarimax", back_populates="modele", cascade="all, delete", uselist=False)


class Arima(Base):
    __tablename__ = "arimas"

    id = Column(Integer, primary_key=True, index=True)
    p = Column(Float)
    q = Column(Float)
    d = Column(Integer)

    modele_id = Column(Integer, ForeignKey("modeles.id"))
    modele = relationship("Modele", back_populates="arima")


class Sarima(Base):
    __tablename__ = "sarimas"

    id = Column(Integer, primary_key=True, index=True)
    p = Column(Float)
    q = Column(Float)
    d = Column(Integer)
    P = Column(Float)
    Q = Column(Float)
    D = Column(Integer)
    s = Column(Integer)

    modele_id = Column(Integer, ForeignKey("modeles.id"))
    modele = relationship("Modele", back_populates="sarima")


class Sarimax(Base):
    __tablename__ = "sarimaxs"

    id = Column(Integer, primary_key=True, index=True)
    p = Column(Float)
    q = Column(Float)
    d = Column(Integer)
    P = Column(Float)
    Q = Column(Float)
    D = Column(Integer)
    s = Column(Integer)
    exo = Column(Float)

    modele_id = Column(Integer, ForeignKey("modeles.id"))
    modele = relationship("Modele", back_populates="sarimax")


# Table d'association entre modèles et données pour la relation "prédire"
from sqlalchemy import Table

modeles_donnees = Table(
    "modeles_donnees",
    Base.metadata,
    Column("modele_id", Integer, ForeignKey("modeles.id")),
    Column("donnee_id", Integer, ForeignKey("donnees.id")),
)