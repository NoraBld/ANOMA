from fastapi import APIRouter, Request, Depends
from sqlalchemy.orm import Session
from fastapi.responses import JSONResponse
from datetime import date
from database import get_db
from models import Deeplearning, Statistique, Prediction, Resultat, Admin
from fastapi import HTTPException


router = APIRouter()

@router.get("/lastprediction")
def get_last_prediction(db: Session = Depends(get_db)):
    # 1️⃣ Récupérer la dernière date de création
    last = db.query(Prediction).order_by(Prediction.date_creation.desc()).first()
    if not last:
        raise HTTPException(status_code=404, detail="Aucune prédiction disponible")
    
    # 2️⃣ Charger ses résultats associés
    results = db.query(Resultat).filter(Resultat.id_prediction == last.id_prediction).all()
    
    if not results:
        raise HTTPException(status_code=404, detail="Aucune valeur pour la dernière prédiction")
    
    # 3️⃣ Reconstruction des données par mois
    data = [{"mois": r.mois, "annee": r.annee, "valeur": r.valeur} for r in results]
    
    # 4️⃣ Conversion en structure similaire à allPredictions
    # Ici, on estime qu'il n'y a qu'une seule méthode (le modèle sélectionné)
    dates = [f"{d['annee']}-{d['mois']:02d}" for d in data]
    valeurs = [d["valeur"] for d in data]
    
    response = [{
        "methode": last.id_prediction,  # ou un nom explicite si disponible
        "Date": dates,
        "Valeurs": valeurs
    }]
    
    return response