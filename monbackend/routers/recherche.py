from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func
from database import get_db
from models import Prediction, Resultat, Consommation

router = APIRouter()

@router.get("/predictions")
def get_all_predictions(db: Session = Depends(get_db)):
    predictions = (
        db.query(Prediction)
          .options(joinedload(Prediction.resultats))
          .order_by(Prediction.date_creation.desc())
          .all()
    )

    consommations_brutes = (
        db.query(
            Consommation.mois,
            Consommation.annee,
            func.sum(Consommation.valeur).label("valeur")
        )
        .group_by(Consommation.mois, Consommation.annee)
        .all()
    )

    conso_map = {(c.mois, c.annee): c.valeur for c in consommations_brutes}

    result = []

    for p in predictions:
        # STATISTIQUE
        if p.statistique:
            method_name = p.statistique.nom_methode
            error_rate = p.statistique.mape
            params = {
                "p": p.statistique.p,
                "q": p.statistique.q,
                "d": p.statistique.d,
                "P": p.statistique.P,
                "Q": p.statistique.Q,
                "D": p.statistique.D,
                "saisonalite": p.statistique.saisonalite,
                "AIC": p.statistique.AIC,
            }

        # DEEP LEARNING (GRU)
        elif p.deeplearning:
            method_name = "GRU"
            error_rate = p.deeplearning.mape
            params = {
                "units1": p.deeplearning.units1,
                "units2": p.deeplearning.units2,
                "units3": p.deeplearning.units3,
                "epochs": p.deeplearning.epochs,
                "batch_size": p.deeplearning.batch_size,
                "time_step": p.deeplearning.time_step,
               
                "loss": p.deeplearning.loss,
                "dropout": p.deeplearning.dropout,
                "learning_rate": p.deeplearning.learning_rate,
                "split_ratio": p.deeplearning.split_ratio,
            }

        # AUCUNE MÉTHODE
        else:
            method_name = "Inconnu"
            error_rate = None
            params = {}

        predicted_data = []
        real_data = []

        for r in p.resultats:
            predicted_data.append({
                "valeur": r.valeur,
                "mois": r.mois,
                "annee": r.annee,
            })

            real_val = conso_map.get((r.mois, r.annee))
            if real_val is not None:
                real_data.append({
                    "valeur": real_val,
                    "mois": r.mois,
                    "annee": r.annee,
                })

        result.append({
            "id": p.id_prediction,
            "title": f"Prédiction du {p.date_creation.strftime('%d/%m/%Y')}",
            "date": p.date_creation.strftime('%Y-%m-%d'),
            "period": p.periode,
            "method": method_name,
            "errorRate": error_rate,
            "params": params,
            "predicted": predicted_data,
            "real": real_data,
            "hasRealData": len(real_data) > 0
        })

    return result
