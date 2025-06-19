# from fastapi import APIRouter, HTTPException, Depends
# from pydantic import BaseModel, EmailStr
# from sqlalchemy.orm import Session
# from database import get_db
# from models import Client
# from passlib.context import CryptContext

# router = APIRouter()
# pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# class ClientUpdate(BaseModel):
#     id: int
#     codeClient: int
#     email: EmailStr
#     telephone: str
#     adresse: str
#     currentPassword: str | None = None
#     newPassword: str | None = None

# @router.post("/client/update-profile")
# def update_client_profile(data: ClientUpdate, db: Session = Depends(get_db)):
#     client = db.query(Client).filter(Client.id == data.id).first()

#     if not client:
#         raise HTTPException(status_code=404, detail="Client introuvable")

#     # Vérifier si l'email existe déjà chez un autre client
#     existing_email = db.query(Client).filter(Client.email == data.email, Client.id != data.id).first()
#     if existing_email:
#         raise HTTPException(status_code=400, detail="Email déjà utilisé")

#     # Vérifier si le téléphone existe déjà chez un autre client
#     existing_phone = db.query(Client).filter(Client.telephone == data.telephone, Client.id != data.id).first()
#     if existing_phone:
#         raise HTTPException(status_code=400, detail="Téléphone déjà utilisé")

#     # Vérification et mise à jour du mot de passe si demandé
#     if data.newPassword:
#         if not data.currentPassword:
#             raise HTTPException(status_code=400, detail="Mot de passe actuel requis.")
#         if not pwd_context.verify(data.currentPassword, client.motdepasse):
#             raise HTTPException(status_code=400, detail="Mot de passe actuel incorrect.")
#         client.motdepasse = pwd_context.hash(data.newPassword)

#     # Mise à jour des autres champs
#     client.codeClient = data.codeClient
#     client.email = data.email
#     client.telephone = data.telephone
#     client.adresse = data.adresse

#     db.commit()
#     db.refresh(client)

#     return {
#         "message": "Profil mis à jour avec succès.",
#         "client": {
#             "id": client.id,
#             "codeClient": client.codeClient,
#             "nom": client.nom,
#             "prenom": client.prenom,
#             "email": client.email,
#             "telephone": client.telephone,
#             "adresse": client.adresse,
#             "date_naissance": client.date_naissance
#         }
#     }
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session
from database import get_db
from models import Client
from passlib.context import CryptContext

router = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# 🔐 Schéma de mise à jour
class ClientUpdate(BaseModel):
    id: int
    codeClient: int
    email: EmailStr
    telephone: str
    adresse: str
    currentPassword: str | None = None
    newPassword: str | None = None

@router.post("/client/update-profile")
def update_client_profile(data: ClientUpdate, db: Session = Depends(get_db)):
    # 🔍 Recherche du client
    client = db.query(Client).filter(Client.id == data.id).first()

    if not client:
        raise HTTPException(status_code=404, detail="Client introuvable")

    # ✅ Vérification email unique
    existing_email = db.query(Client).filter(Client.email == data.email, Client.id != data.id).first()
    if existing_email:
        raise HTTPException(status_code=400, detail="Email déjà utilisé")

    # ✅ Vérification téléphone unique
    existing_phone = db.query(Client).filter(Client.telephone == data.telephone, Client.id != data.id).first()
    if existing_phone:
        raise HTTPException(status_code=400, detail="Téléphone déjà utilisé")

    # 🔐 Mise à jour du mot de passe
    if data.newPassword:
        if not data.currentPassword:
            raise HTTPException(status_code=400, detail="Mot de passe actuel requis.")
        if not pwd_context.verify(data.currentPassword, client.password):
            raise HTTPException(status_code=400, detail="Mot de passe actuel incorrect.")
        client.password = pwd_context.hash(data.newPassword)

    # 🛠️ Mise à jour des champs simples
    client.codeClient = data.codeClient
    client.email = data.email
    client.telephone = data.telephone
    client.adresse = data.adresse

    # 💾 Commit
    db.commit()
    db.refresh(client)

    return {
        "message": "Profil mis à jour avec succès.",
        "client": {
            "id": client.id,
            "codeClient": client.codeClient,
            "nom": client.nom,
            "prenom": client.prenom,
            "email": client.email,
            "telephone": client.telephone,
            "adresse": client.adresse,
            "date_naissance": client.date_naissance
        }
    }
