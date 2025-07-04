
from typing import Optional, List
from pydantic import BaseModel, EmailStr, Field
from datetime import date





# ---------- CLIENTS ----------

class ClientCreate(BaseModel):
    codeClient: int
    nom: str = Field(..., min_length=1, description="Nom obligatoire")
    prenom: str = Field(..., min_length=1)
    adresse: str = Field(..., min_length=1)
    telephone: str = Field(..., min_length=1)
    date_naissance: date
    email: EmailStr


class ClientOut(BaseModel):
    id: int
    codeClient: int
    nom: str
    prenom: str
    adresse: str
    telephone: str
    date_naissance: date
    email: EmailStr

    model_config = {
        "from_attributes": True
    }


class ClientUpdate(BaseModel):
    codeClient: int
    nom: str
    prenom: str
    adresse: str
    telephone: str
    date_naissance: date
    email: EmailStr

    model_config = {
        "from_attributes": True
    }
    


class ClientUpdateProfile(BaseModel):
    id: int
    codeClient: int
    email: Optional[EmailStr] = None
    telephone: Optional[str] = None
    adresse: Optional[str] = None
    currentPassword: Optional[str] = None
    newPassword: Optional[str] = None


class ClientLogin(BaseModel):
    email: EmailStr
    motdepasse: str


# ---------- ADMIN ----------

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

    model_config = {
        "from_attributes": True
    }


# ---------- PREDICTION ----------

class PredictionSarimax(BaseModel):
    periode: int


class PredictionOut(BaseModel):
    id_prediction: int
    periode: int
    date_creation: date

    model_config = {
        "from_attributes": True
    }


# ---------- CONSOMMATION ----------

class ConsommationOut(BaseModel):
    heure: str  # ou datetime si tu veux plus de précision
    consommation: float

    model_config = {
        "from_attributes": True
    }


# ---------- UTILISATEUR (Admin/Profile) ----------

class UtilisateurUpdate(BaseModel):
    nom: Optional[str]
    email: Optional[str]
    mot_de_passe: Optional[str]
    secteur: Optional[str]
    photo_profil: Optional[str]


class PredictionBase(BaseModel):
    id_prediction: int
    periode: int
    date_creation: date
    method: Optional[str] = "Inconnu"
    errorRate: Optional[float]
    params: Optional[dict] = {}
    title: str
    predicted: List[float]
    real: List[float]

    
    model_config = {
        "from_attributes": True
    }



class PredictionResponse(BaseModel):
    id_prediction: int
    date_creation: date
    periode: int
    method: str
    errorRate: float
    params: dict
    title: str
    predicted: List[float]
    real: List[float]

   
    model_config = {
        "from_attributes": True
    }
