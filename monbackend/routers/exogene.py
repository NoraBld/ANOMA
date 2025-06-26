from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
import pandas as pd
from sqlalchemy.orm import Session
from models import Exogene
from database import get_db

router = APIRouter()

@router.post("/exogene/upload")
async def upload_exogene(file: UploadFile = File(...), db: Session = Depends(get_db)):
    try:
        # Lire le fichier selon son type
        if file.filename.endswith(".csv"):
            df = pd.read_csv(file.file)
        elif file.filename.endswith(".xlsx"):
            df = pd.read_excel(file.file)
        else:
            raise HTTPException(status_code=400, detail="Format de fichier non supporté.")

        # Vérifier colonnes attendues
        if not {"mois", "annee", "valeur"}.issubset(df.columns):
            raise HTTPException(status_code=400, detail="Colonnes attendues : mois, annee, valeur")

        # Insérer dans la base
        for _, row in df.iterrows():
            exog = Exogene(mois=int(row["mois"]), annee=int(row["annee"]), valeur=float(row["valeur"]))
            db.add(exog)
        db.commit()

        return {"message": "Fichier exogène importé avec succès"}

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Erreur lors de l'import : {str(e)}")
