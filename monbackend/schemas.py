
from typing import Optional
from pydantic import BaseModel, EmailStr, Field
from datetime import date


class ClientCreate(BaseModel):
    codeClient: int
    nom: str = Field(..., min_length=1, description="Nom obligatoire")
    prenom: str = Field(..., min_length=1)
    adresse: str = Field(..., min_length=1)
    telephone: str = Field(..., min_length=1)
    date_naissance: date
    email: EmailStr
    # motdepasse: str = Field(..., min_length=6)


class ClientOut(BaseModel):
    id: int
    codeClient: int
    nom: str
    prenom: str
    adresse: str
    telephone: str
    date_naissance: date
    email: EmailStr

    class Config:
        orm_mode = True






class ClientUpdate(BaseModel):
    codeClient: int
    nom: str
    prenom: str
    adresse: str
    telephone: str
    date_naissance: date
    email: EmailStr

    class Config:
        orm_mode = True




class ClientLogin(BaseModel):
    email: EmailStr
    motdepasse: str


class ClientUpdateProfile(BaseModel):
    id: int
    codeClient:int
    email: Optional[EmailStr] = None
    telephone: Optional[str] = None
    adresse: Optional[str] = None
    currentPassword: Optional[str] = None
    newPassword: Optional[str] = None


class PredictionSarimax(BaseModel):
    periode: int



class ConsommationOut(BaseModel):
    heure: str  # ou `datetime` si tu veux traiter les heures plus précisément
    consommation: float

    class Config:
        orm_mode = True


class AdminLogin(BaseModel):
    email: EmailStr
    motdepasse: str



class AdminOut(BaseModel):
    id: int
    nom_Entreprise: str
    email: str
    secteur: str
    telephone: str
    logo: Optional[str]

    class Config:
        orm_mode = True
