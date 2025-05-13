from sqlalchemy import Column, Integer, String
# from .database import Base
from database import Base



# class Utilisateur(Base):
#     __tablename__ = "utilisateur"  # exactement comme dans ta base PostgreSQL

#     id = Column(Integer, primary_key=True, index=True)
#     nom = Column(String)
#     email = Column(String, unique=True, index=True)
#     mot_de_passe = Column(String)
#     secteur = Column(String)
#     photo_profil = Column(String)  # chemin ou URL de la photo
