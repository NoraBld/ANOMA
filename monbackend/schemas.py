

# from typing import Optional
# from pydantic import BaseModel, EmailStr, Field
# from datetime import date


# class ClientCreate(BaseModel):
#     codeClient: int
#     nom: str = Field(..., min_length=1, description="Nom obligatoire")
#     prenom: str = Field(..., min_length=1)
#     adresse: str = Field(..., min_length=1)
#     telephone: str = Field(..., min_length=1)
#     date_naissance: date
#     email: EmailStr
#     # motdepasse: str = Field(..., min_length=6)


# class ClientOut(BaseModel):
#     id: int
#     codeClient: int
#     nom: str
#     prenom: str
#     adresse: str
#     telephone: str
#     date_naissance: date
#     email: EmailStr


#     model_config = {
#         "from_attributes": True
#     }


    


# class UtilisateurUpdate(BaseModel):
#     nom: Optional[str]
#     email: Optional[str]
#     mot_de_passe: Optional[str]
#     secteur: Optional[str]
#     photo_profil: Optional[str]






# class ClientUpdate(BaseModel):
#     codeClient: int
#     nom: str
#     prenom: str
#     adresse: str
#     telephone: str
#     date_naissance: date
#     email: EmailStr

#     model_config = {
#         "from_attributes": True
#     }

    




# class ClientLogin(BaseModel):
#     email: EmailStr
#     motdepasse: str


# class ClientUpdateProfile(BaseModel):
#     id: int
#     codeClient:int
#     email: Optional[EmailStr] = None
#     telephone: Optional[str] = None
#     adresse: Optional[str] = None
#     currentPassword: Optional[str] = None
#     newPassword: Optional[str] = None


# class PredictionSarimax(BaseModel):
#     periode: int



# class ConsommationOut(BaseModel):
#     heure: str  # ou `datetime` si tu veux traiter les heures plus précisément
#     consommation: float

#     class Config:
#         from_attributes = True 


# class AdminLogin(BaseModel):
#     email: EmailStr
#     motdepasse: str



# class AdminOut(BaseModel):
#     id: int
#     nom_Entreprise: str
#     email: str
#     secteur: str
#     telephone: str
#     logo: Optional[str]

#     model_config = {
#         "from_attributes": True
#     }




from typing import Optional
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
