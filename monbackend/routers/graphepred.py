from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from models import Prediction, Statistique, Deeplearning
from database import get_db

router = APIRouter()

@router.get("/last-prediction")
def get_last_prediction(db: Session = Depends(get_db)):
    last_prediction = db.query(Prediction).order_by(Prediction.date_creation.desc()).first()

    if not last_prediction:
        return {"message": "Aucune prédiction trouvée"}

    result = {
        "date_creation": last_prediction.date_creation,
        "periode": last_prediction.periode,
    }

    if last_prediction.id_statistique:
        stat = db.query(Statistique).filter(Statistique.id_statistique == last_prediction.id_statistique).first()
        result["method"] = stat.nom_methode
        result["params"] = {
            "p": stat.p,
            "q": stat.q,
            "d": stat.d,
            "P": stat.P,
            "Q": stat.Q,
            "D": stat.D,
            "saisonnalite": stat.saisonalite,
            "AIC": stat.AIC,
            "mape": stat.mape
        }
    elif last_prediction.id_deeplearning:
        dl = db.query(Deeplearning).filter(Deeplearning.id_deeplearning == last_prediction.id_deeplearning).first()

        result["method"] = "GRU"

        if dl:
            result["params"] = {
                "units": f"{dl.units1}-{dl.units2}-{dl.units3}",
                "epochs": dl.epochs,
                "batch_size": dl.batch_size,
                "time_step": dl.time_step,
                
                "dropout": dl.dropout,
                "learning_rate": dl.learning_rate,
                "split_ratio": dl.split_ratio,
                "mape": dl.mape
            }
        else:
            result["params"] = {
                "mape": 0
            }

    return result
