
from fastapi import APIRouter, HTTPException, Depends, UploadFile, File, Form
from sqlalchemy.orm import Session
from models import Client, Consommation
from database import get_db
from utils import hash_password
import pandas as pd
from io import BytesIO

router = APIRouter()

@router.get("/clients/email-exists")
def email_exists(email: str, db: Session = Depends(get_db)):
    client = db.query(Client).filter(Client.email == email).first()
    return {"exists": client is not None}

@router.put("/clients/{client_id}/with-consommation")
async def update_client_with_file(
    client_id: int,
    codeClient: int = Form(...),
    nom: str = Form(...),
    prenom: str = Form(...),
    adresse: str = Form(...),
    telephone: str = Form(...),
    date_naissance: str = Form(...),
    email: str = Form(...),
    file: UploadFile = File(None),
    db: Session = Depends(get_db)
):
    client = db.query(Client).filter(Client.id == client_id).first()
    if not client:
        raise HTTPException(status_code=404, detail="Client non trouvé")

    # Vérifications d'unicité
    if db.query(Client).filter(Client.email == email, Client.id != client_id).first():
        raise HTTPException(status_code=400, detail="Email déjà utilisé")
    if db.query(Client).filter(Client.telephone == telephone, Client.id != client_id).first():
        raise HTTPException(status_code=400, detail="Téléphone déjà utilisé")
    if db.query(Client).filter(Client.codeClient == codeClient, Client.id != client_id).first():
        raise HTTPException(status_code=400, detail="Code client déjà utilisé")

    # Mise à jour des champs
    client.codeClient = codeClient
    client.nom = nom
    client.prenom = prenom
    client.adresse = adresse
    client.telephone = telephone
    client.date_naissance = date_naissance
    client.email = email

    # Met à jour le mot de passe si la date de naissance a changé
    if client.date_naissance != date_naissance:
        client.password = hash_password(date_naissance)

    db.commit()
    db.refresh(client)

    # Traitement du fichier consommation (si fourni)
    if file:
        try:
            contents = await file.read()
            if file.filename.endswith(".csv"):
                df = pd.read_csv(BytesIO(contents))
            elif file.filename.endswith(".xlsx"):
                df = pd.read_excel(BytesIO(contents))
            else:
                raise HTTPException(status_code=400, detail="Format de fichier non supporté.")
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Erreur lecture fichier: {str(e)}")

        expected_columns = {"mois", "annee", "valeur"}
        if not expected_columns.issubset(df.columns):
            raise HTTPException(status_code=400, detail="Colonnes attendues: mois, annee, valeur")

        # Ajouter sans supprimer les anciennes consommations
        for _, row in df.iterrows():
            existing = db.query(Consommation).filter(
                Consommation.id_client == client.id,
                Consommation.mois == int(row["mois"]),
                Consommation.annee == int(row["annee"])
            ).first()

            if not existing:
                consommation = Consommation(
                    mois=int(row["mois"]),
                    annee=int(row["annee"]),
                    valeur=float(row["valeur"]),
                    id_client=client.id,
                )
                db.add(consommation)

        db.commit()

    return client
