from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List
from pydantic import EmailStr
import pandas as pd
from io import BytesIO
from datetime import date
import models
import schemas
from database import get_db
from utils import hash_password

router = APIRouter()

@router.post("/clients/with-consommation", response_model=schemas.ClientOut)
async def create_client_with_consumption(
    codeClient: int = Form(...),
    nom: str = Form(...),
    prenom: str = Form(...),
    adresse: str = Form(...),
    telephone: str = Form(...),
    date_naissance: date = Form(...),
    email: EmailStr = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    # Vérification unicité
    if db.query(models.Client).filter(models.Client.codeClient == codeClient).first():
        raise HTTPException(status_code=400, detail="Code client déjà utilisé.")
    if db.query(models.Client).filter(models.Client.email == email).first():
        raise HTTPException(status_code=400, detail="Email déjà utilisé.")
    if db.query(models.Client).filter(models.Client.telephone == telephone).first():
        raise HTTPException(status_code=400, detail="Téléphone déjà utilisé.")

    hashed_password = hash_password(date_naissance.isoformat())

    client = models.Client(
        codeClient=codeClient,
        nom=nom,
        prenom=prenom,
        adresse=adresse,
        telephone=telephone,
        date_naissance=date_naissance,
        email=email,
        password=hashed_password,
    )
    db.add(client)
    db.commit()
    db.refresh(client)

    # Lecture fichier consommation
    try:
        contents = await file.read()
        if file.filename.endswith(".csv"):
            df = pd.read_csv(BytesIO(contents))
        elif file.filename.endswith(".xlsx"):
            df = pd.read_excel(BytesIO(contents))
        else:
            raise HTTPException(status_code=400, detail="Format de fichier non supporté.")
    except Exception as e:
        db.delete(client)
        db.commit()
        raise HTTPException(status_code=400, detail=f"Erreur lecture fichier: {str(e)}")

    # Colonnes attendues
    expected_columns = {"mois", "annee", "valeur"}
    if not expected_columns.issubset(df.columns):
        db.delete(client)
        db.commit()
        raise HTTPException(status_code=400, detail="Colonnes attendues: mois, annee, valeur")

    # Ajout consommations
    for _, row in df.iterrows():
        consommation = models.Consommation(
            mois=int(row["mois"]),
            annee=int(row["annee"]),
            valeur=float(row["valeur"]),
            id_client=client.id,
        )
        db.add(consommation)

    db.commit()
    return client

@router.post("/clients", response_model=schemas.ClientOut)
def create_client(client: schemas.ClientCreate, db: Session = Depends(get_db)):
    # Vérification unicité codeClient
    if db.query(models.Client).filter(models.Client.codeClient == client.codeClient).first():
        raise HTTPException(status_code=400, detail="Code client déjà utilisé.")
    
    # Vérification unicité email
    if db.query(models.Client).filter(models.Client.email == client.email).first():
        raise HTTPException(status_code=400, detail="Email déjà utilisé.")
    
    # Vérification unicité téléphone
    if db.query(models.Client).filter(models.Client.telephone == client.telephone).first():
        raise HTTPException(status_code=400, detail="Téléphone déjà utilisé.")

    # Utiliser la date de naissance comme mot de passe initial
    # Si client.date_naissance est déjà un objet date (ce qui est le cas via Pydantic), pas besoin de le convertir
    raw_password = client.date_naissance.isoformat()
    hashed_password = hash_password(raw_password)

    db_client = models.Client(
        codeClient=client.codeClient,
        nom=client.nom,
        prenom=client.prenom,
        adresse=client.adresse,
        telephone=client.telephone,
        date_naissance=client.date_naissance,
        email=client.email,
        password=hashed_password
    )

    db.add(db_client)
    db.commit()
    db.refresh(db_client)
    return db_client


@router.get("/clients", response_model=List[schemas.ClientOut])
def read_clients(db: Session = Depends(get_db)):
    return db.query(models.Client).all()


@router.delete("/clients/{client_id}")
def delete_client(client_id: int, db: Session = Depends(get_db)):
    client = db.query(models.Client).filter(models.Client.id == client_id).first()
    if not client:
        raise HTTPException(status_code=404, detail="Client non trouvé")
    db.delete(client)
    db.commit()
    return {"message": "Client supprimé avec succès"}
