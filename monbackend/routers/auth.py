

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Client , Admin
from utils import verify_password
from auth_utils import create_access_token
from schemas import ClientLogin, ClientOut , AdminLogin
from datetime import timedelta

router = APIRouter()

@router.post("/login")
def login(client_login: ClientLogin, db: Session = Depends(get_db)):
    client = db.query(Client).filter(Client.email == client_login.email).first()
    if not client or not verify_password(client_login.motdepasse, client.password):
        raise HTTPException(status_code=401, detail="Email ou mot de passe incorrect")

    token_data = {"sub": str(client.id)}
    access_token = create_access_token(data=token_data, expires_delta=timedelta(minutes=60))

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "client": {
            "id": client.id,
            "codeClient":client.codeClient,
            "nom": client.nom,
            "prenom": client.prenom,
            "email": client.email,
            "telephone": client.telephone,
            "adresse": client.adresse,
            "date_naissance":client.date_naissance
        }
    }




@router.post("/login_admin")
def login_admin(admin_login: AdminLogin, db: Session = Depends(get_db)):
    admin = db.query(Admin).filter(Admin.email == admin_login.email).first()
    if not admin or not verify_password(admin_login.motdepasse, admin.mot_de_passe):
        raise HTTPException(status_code=401, detail="Email ou mot de passe incorrect")
    

    
    token_data = {"sub": str(admin.id), "role": "admin"}
    access_token = create_access_token(data=token_data, expires_delta=timedelta(minutes=60))


    

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "admin": {
            "id": admin.id,
            "email": admin.email,
            "nom_Entreprise": admin.nom_Entreprise,
            "secteur": admin.secteur,
            "telephone": admin.telephone,
            "logo": admin.logo,
            "taille_dataset": admin.taille_dataset
        }
    }

