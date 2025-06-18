from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models import Prediction, Resultat

router = APIRouter()

@router.get("/predictions")
def get_all_predictions(db: Session = Depends(get_db)):
    predictions = db.query(Prediction).order_by(Prediction.date_creation.desc()).all()

    result = []
    for p in predictions:
        result.append({
            "id": p.id_prediction,
            "title": f"Prédiction du {p.date_creation.strftime('%d/%m/%Y')}",
            "date": p.date_creation.strftime('%Y-%m-%d'),
            "period": p.periode,
            "method": p.statistique.nom_methode if p.statistique else "Inconnu",
            "errorRate": p.statistique.mape if p.statistique else None,
            "params": {
                "p": p.statistique.p,
                "q": p.statistique.q,
                "d": p.statistique.d,
                "P": p.statistique.P,
                "Q": p.statistique.Q,
                "D": p.statistique.D,
                "saisonalite": p.statistique.saisonalite,
                "AIC": p.statistique.AIC,
            } if p.statistique else {},
            "predicted": [r.valeur for r in p.resultats],
            "real": []  # Tu peux ajouter les vraies données ici si disponibles
        })
    return result
