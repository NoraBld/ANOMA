from fastapi import APIRouter, UploadFile, File, Form, Depends
from sqlalchemy.orm import Session
import pandas as pd
from io import StringIO
from sqlalchemy import extract, func
from models import Client, Consommation, Resultat, Prediction
from database import get_db
from auth_utils import get_current_client

router = APIRouter()

@router.post("/import-clients")
async def import_client_et_consommation(
    nom: str = Form(...),
    prenom: str = Form(...),
    email: str = Form(...),
    date_naissance: str = Form(...),
    file: UploadFile = File(None),
    db: Session = Depends(get_db)
):
 

    # 2. Si un fichier est fourni, ajouter les consommations
    if file:
        content = await file.read()
        try:
            df = pd.read_csv(StringIO(content.decode("utf-8")))
        except Exception as e:
            return {"error": f"Erreur lecture CSV : {str(e)}"}

        for _, row in df.iterrows():
            try:
                consommation = Consommation(
                    mois=int(row["mois"]),
                    annee=int(row["annee"]),
                    valeur=float(row["valeur"]),
                    id_client=nouveau_client.id
                )
                db.add(consommation)
            except Exception as e:
                print(f"Erreur parsing ligne: {row} {e}")
                continue

        db.commit()

    return {"message": "Client et consommations ajoutés avec succès"}



@router.get("/clients/{client_id}/consommations")
def get_consommations(client_id: int, db: Session = Depends(get_db)):
    consommations = (
        db.query(Consommation)
        .filter(Consommation.id_client == client_id)  
        .order_by(Consommation.annee, Consommation.mois) 
        .all()
    )
    if not consommations:
        raise HTTPException(status_code=404, detail="Aucune consommation trouvée")
    
    return [
        {
            "mois": conso.mois,
            "annee": conso.annee,
            "valeur": conso.valeur,
            # "prediction": conso.prediction,  # enleve ou ajoute si tu as ce champ
        }
        for conso in consommations   
    ]


# dashboard
@router.get("/consommation/mensuelle")
def get_consommation_mensuelle(db: Session = Depends(get_db)):
    results = (
        db.query(
            Consommation.annee.label("annee"),
            Consommation.mois.label("mois"),
            func.sum(Consommation.valeur).label("total_valeur")
        )
        .group_by(Consommation.annee, Consommation.mois)
        .order_by(Consommation.annee, Consommation.mois)
        .all()
    )

    return [
        {
            "date": f"{r.annee}-{r.mois:02d}",
            "valeur": float(r.total_valeur)
        }
        for r in results
    ]



# 
@router.get("/stats/globales")
def get_stats_globales(db: Session = Depends(get_db)):
    # Nombre total de clients
    total_clients = db.query(Client).count()

    # Consommations groupées par an
    consommation_par_annee = db.query(
        Consommation.annee,
        func.sum(Consommation.valeur).label("total")
    ).group_by(Consommation.annee).all()

    # Moyenne par année
    moy_annee = (
        sum(r.total for r in consommation_par_annee) / len(consommation_par_annee)
        if consommation_par_annee else 0
    )

    # Total mois
    total_mois = db.query(Consommation).count()
    total_valeur = db.query(func.sum(Consommation.valeur)).scalar() or 0
    moy_mois = (total_valeur / total_mois) if total_mois > 0 else 0

    return {
        "total_clients": total_clients,
        "moyenne_par_annee": round(moy_annee, 2),
        "moyenne_par_mois": round(moy_mois, 2)
    }


# tableau
@router.get("/consommations/toutes")
def get_all_consommations(db: Session = Depends(get_db)):
    consommations = db.query(Consommation).join(Client).all()
    return [
        {
            "date": f"{c.annee}-{str(c.mois).zfill(2)}-01",
            "valeur": c.valeur,
            "code_client": c.client.codeClient
        }
        for c in consommations
    ]



# histogramme
@router.get("/consommation/par-annee")
def get_consommation_par_annee(db: Session = Depends(get_db)):
    results = (
        db.query(
            Consommation.annee.label("annee"),
            func.sum(Consommation.valeur).label("total_valeur")
        )
        .group_by(Consommation.annee)
        .order_by(Consommation.annee)
        .all()
    )

    return [{"annee": r.annee, "valeur": float(r.total_valeur)} for r in results]




@router.get("/client/mes-consommations")
def get_mes_consommations(
    db: Session = Depends(get_db),
    current_client = Depends(get_current_client)
):
    consommations = db.query(Consommation).filter(Consommation.id_client == current_client.id).all()
    return consommations








@router.get("/prediction/mensuelle")
def get_predictions_mensuelles(db: Session = Depends(get_db)):
    # Récupérer la dernière prédiction (selon la date ou l'ID)
    last_prediction = (
        db.query(Prediction)
        .order_by(Prediction.date_creation.desc())
        .first()
    )

    if not last_prediction:
        return []

    resultats = (
        db.query(Resultat)
        .filter(Resultat.id_prediction == last_prediction.id_prediction)
        .order_by(Resultat.annee, Resultat.mois)
        .all()
    )

    return [
        {
            "date": f"{r.annee}-{r.mois:02d}",
            "valeur": float(r.valeur)
        }
        for r in resultats
    ]




@router.get("/prediction/count")
def count_all_predictions(db: Session = Depends(get_db)):
    total = db.query(Prediction).count()
    return {"total_predictions": total}



@router.get("/prediction/last-date")
def get_last_prediction_date(db: Session = Depends(get_db)):
    last_prediction = (
        db.query(Prediction)
        .order_by(Prediction.date_creation.desc())
        .first()
    )

    if not last_prediction:
        return {"last_date": None}

    return {"last_date": last_prediction.date_creation.strftime("%Y-%m-%d")}




@router.get("/prediction/last-duree")
def get_last_prediction_duration(db: Session = Depends(get_db)):
    last_prediction = (
        db.query(Prediction)
        .order_by(Prediction.created_at.desc())  # ou selon ta colonne de date
        .first()
    )
    if not last_prediction:
        return {"start": None, "end": None}

    return {
        "start": last_prediction.date_debut.strftime("%Y-%m-%d"),
        "end": last_prediction.date_fin.strftime("%Y-%m-%d")
    }


@router.get("/prediction/resultats")
def get_predictions_et_resultats(db: Session = Depends(get_db)):
    predictions = db.query(Prediction).all()
    
    result = []
    for prediction in predictions:
        for res in prediction.resultats:
            result.append({
                "date_creation": prediction.date_creation.isoformat(),
                "valeur": res.valeur
            })
    
    return result
