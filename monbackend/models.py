from sqlalchemy import Column, Integer, String, Float, DateTime,Date, ForeignKey
from sqlalchemy.orm import relationship
from database import Base
from datetime import datetime 


class Admin(Base):
    __tablename__ = "admin"
    id = Column(Integer, primary_key=True, index=True)
    nom_Entreprise = Column(String(25))
    email = Column(String(25), unique=True, index=True)
    mot_de_passe = Column(String(250))
    secteur = Column(String(25))
    logo = Column(String(50))  # chemin ou URL
    telephone = Column(String(20))
    taille_dataset= Column(Integer)

    predictions = relationship("Prediction", back_populates="admin")

class Deeplearning(Base):
    __tablename__ = "deeplearning"
    id_deeplearning = Column(Integer, primary_key=True, index=True)
    units1 = Column(Integer)
    units2 = Column(Integer)
    units3 = Column(Integer)

    epochs = Column(Integer)
    batch_size = Column(Integer)
    time_step = Column(Integer)
    
    loss = Column(String(100))
    dropout = Column(Float)
    learning_rate = Column(Float)
    split_ratio = Column(Float)
    mape = Column(Float)
    modele_path = Column(String)
    patience = Column(Integer)
    predictions = relationship("Prediction", back_populates="deeplearning")
    clients = relationship("Client", back_populates="deeplearning")



class Client(Base):
    __tablename__ = "clients"

    id = Column(Integer, primary_key=True, index=True)
    codeClient = Column(Integer, nullable=False)
    nom = Column(String)
    prenom = Column(String)
    adresse = Column(String)
    telephone = Column(String)
    date_naissance = Column(Date, nullable=False)
    email = Column(String, unique=True, index=True)
    password = Column(String)  # Correspond à 'motdepasse' dans les schémas
    id_deeplearning = Column(Integer, ForeignKey("deeplearning.id_deeplearning"))

    deeplearning = relationship("Deeplearning", back_populates="clients")
    consommations = relationship("Consommation", back_populates="client")



class Statistique(Base):
    __tablename__ = "statistique"
    id_statistique = Column(Integer, primary_key=True, index=True)
    p = Column(Integer)
    q = Column(Integer)
    d = Column(Integer)
    P = Column(Integer)
    Q = Column(Integer)
    D = Column(Integer)
    saisonalite = Column(Integer)
    AIC = Column(Float)
  
    mape = Column(Float)
    nom_methode = Column(String(100))

    predictions = relationship("Prediction", back_populates="statistique")

class Prediction(Base):
    __tablename__ = "prediction"
    id_prediction = Column(Integer, primary_key=True, index=True)
    periode = Column(Integer)
   
    date_creation = Column(DateTime, default=datetime.now)

    id_admin = Column(Integer, ForeignKey("admin.id"))
    id_deeplearning = Column(Integer, ForeignKey("deeplearning.id_deeplearning"))
    id_statistique = Column(Integer, ForeignKey("statistique.id_statistique"))

    admin = relationship("Admin", back_populates="predictions")
    deeplearning = relationship("Deeplearning", back_populates="predictions")
    statistique = relationship("Statistique", back_populates="predictions")
    resultats = relationship("Resultat", back_populates="prediction")

class Resultat(Base):
    __tablename__ = "resultat"
    id_resultat = Column(Integer, primary_key=True, index=True)
    mois = Column(Integer)
    annee = Column(Integer)
    valeur = Column(Float)

    id_prediction = Column(Integer, ForeignKey("prediction.id_prediction"))
    prediction = relationship("Prediction", back_populates="resultats")

class Consommation(Base):
    __tablename__ = "consommation"
    id_consommation = Column(Integer, primary_key=True, index=True)
    mois = Column(Integer)
    annee = Column(Integer)
    valeur = Column(Float)

    id_client = Column(Integer, ForeignKey("clients.id"), nullable=True)
    client = relationship("Client", back_populates="consommations")





class Exogene(Base):
    __tablename__ = "exogene"
    id_exogene = Column(Integer, primary_key=True, index=True)
    mois = Column(Integer)
    annee = Column(Integer)
    valeur = Column(Float)
