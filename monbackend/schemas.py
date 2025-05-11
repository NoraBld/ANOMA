from pydantic import BaseModel
from typing import Optional

class UtilisateurCreate(BaseModel):
    nom: str
    email: str
    mot_de_passe: str
    secteur: str
    photo_profil: str  # URL ou nom de fichier

class UtilisateurResponse(UtilisateurCreate):
    id: int

    class Config:
        orm_mode = True

class UtilisateurUpdate(BaseModel):
    nom: Optional[str]
    email: Optional[str]
    mot_de_passe: Optional[str]
    secteur: Optional[str]
    photo_profil: Optional[str]
