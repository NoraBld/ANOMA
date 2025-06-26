from fastapi import APIRouter, UploadFile, File, Form, Depends
from sqlalchemy.orm import Session
import pandas as pd
from io import StringIO
from sqlalchemy import extract, func, desc ,asc
from models import Client, Consommation, Resultat, Prediction,Deeplearning
from database import get_db
from auth_utils import get_current_client
from fastapi import APIRouter, Depends, HTTPException


import numpy as np
from sklearn.preprocessing import MinMaxScaler
from sklearn.metrics import mean_absolute_percentage_error
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import GRU, Dense, Dropout
from tensorflow.keras.optimizers import Adam

from datetime import datetime
from dateutil.relativedelta import relativedelta


from tensorflow.keras.models import load_model

import os



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
    client = db.query(Client).filter(Client.id == client_id).first()
    if not client:
        raise HTTPException(status_code=404, detail="Client introuvable")

    consommations = (
        db.query(Consommation)
        .filter(Consommation.id_client == client_id)
        .order_by(Consommation.annee, Consommation.mois)
        .all()
    )
    if not consommations:
        raise HTTPException(status_code=404, detail="Aucune consommation trouvée")

    modele = (
        db.query(Deeplearning)
        .filter(Deeplearning.id_deeplearning == client.id_deeplearning)
        .first()
    )
    if not modele or not modele.modele_path:
        raise HTTPException(status_code=404, detail="Modèle non trouvé ou chemin manquant")

    if not os.path.exists(modele.modele_path):
        raise HTTPException(status_code=404, detail="Fichier du modèle introuvable sur le disque")

    # Chargement du modèle GRU enregistré
    model = load_model(modele.modele_path)

    # Préparation des données
    data = {
        "mois": [c.mois for c in consommations],
        "annee": [c.annee for c in consommations],
        "valeur": [c.valeur for c in consommations],
    }
    df = pd.DataFrame(data)
    df["date"] = pd.to_datetime(df["annee"].astype(str) + "-" + df["mois"].astype(str).str.zfill(2))
    df["month"] = df["date"].dt.month
    df["month_sin"] = np.sin(2 * np.pi * df["month"] / 12)
    df["month_cos"] = np.cos(2 * np.pi * df["month"] / 12)

    sequence_length = modele.time_step or 12
    if len(df) < sequence_length + 3:
        raise HTTPException(status_code=400, detail="Pas assez de données pour la prédiction")

    # Normalisation
    scaler = MinMaxScaler()
    features = ["valeur", "month_sin", "month_cos"]
    scaled = scaler.fit_transform(df[features])
    last_input = scaled[-sequence_length:]

    # Prédictions futures sur 3 mois
    future_preds = []
    future_date = df["date"].iloc[-1]
    for _ in range(3):
        pred_input = last_input.reshape(1, sequence_length, 3)
        pred_scaled = model.predict(pred_input, verbose=0)[0][0]

        future_date += relativedelta(months=1)
        mois = future_date.month
        annee = future_date.year
        sin = np.sin(2 * np.pi * mois / 12)
        cos = np.cos(2 * np.pi * mois / 12)
        last_input = np.vstack([last_input[1:], [pred_scaled, sin, cos]])

        pred_val = scaler.inverse_transform([[pred_scaled, sin, cos]])[0][0]
        future_preds.append({
            "mois": mois,
            "annee": annee,
            "prediction": round(pred_val, 2)
        })

    # MAPE sur les 3 derniers mois
    if len(scaled) < sequence_length + 3:
        mape = None
    else:
        X_test, y_test = [], []
        for i in range(len(scaled) - sequence_length - 3, len(scaled) - 3):
            if i + sequence_length >= len(scaled):
                continue
            X_test.append(scaled[i:i + sequence_length])
            y_test.append(scaled[i + sequence_length][0])
        X_test = np.array(X_test)
        y_test = np.array(y_test)

        if len(X_test) == 0:
            mape = None
        else:
            y_pred_scaled = model.predict(X_test, verbose=0).flatten()
            y_pred = scaler.inverse_transform(
                np.hstack([y_pred_scaled.reshape(-1, 1), X_test[:, -1, 1:]])
            )[:, 0]
            y_true = df["valeur"].values[-3:]
            mape = mean_absolute_percentage_error(y_true, y_pred)

    # Format de sortie
    resultats = [
        {
            "mois": conso.mois,
            "annee": conso.annee,
            "valeur": conso.valeur,
        }
        for conso in consommations[-9:]
    ]
   
    return {
        "consommations": resultats,
        "predictions": future_preds,
        "mape": round(mape * 100, 2) if mape is not None else None
    }
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




@router.get("/stats/globales")
def get_stats_globales(db: Session = Depends(get_db)):
    total_clients = db.query(Client).count()

    consommation_par_annee = db.query(
        Consommation.annee,
        func.sum(Consommation.valeur).label("total")
    ).group_by(Consommation.annee).all()

    moy_annee = (
        sum(r.total for r in consommation_par_annee) / len(consommation_par_annee)
        if consommation_par_annee else 0
    )

    total_mois = db.query(Consommation).count()
    total_valeur = db.query(func.sum(Consommation.valeur)).scalar() or 0
    moy_mois = (total_valeur / total_mois) if total_mois > 0 else 0

    consommation_max = db.query(Consommation).order_by(desc(Consommation.valeur)).first()
    consommation_min = db.query(Consommation).order_by(asc(Consommation.valeur)).first()

    consommation_max_dict = None
    consommation_min_dict = None

    if consommation_max and consommation_max.client:
        consommation_max_dict = {
            "valeur": round(consommation_max.valeur, 2),
            "mois": consommation_max.mois,
            "annee": consommation_max.annee,
            "codeClient": consommation_max.client.codeClient
        }

    if consommation_min and consommation_min.client:
        consommation_min_dict = {
            "valeur": round(consommation_min.valeur, 2),
            "mois": consommation_min.mois,
            "annee": consommation_min.annee,
            "codeClient": consommation_min.client.codeClient
        }

    return {
        "total_clients": total_clients,
        "moyenne_par_annee": round(moy_annee, 2),
        "moyenne_par_mois": round(moy_mois, 2),
        "consommation_max": consommation_max_dict,
        "consommation_min": consommation_min_dict
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




@router.get("/client/mes-consommations-pred")
def get_mes_consommations(
    db: Session = Depends(get_db),
    current_client = Depends(get_current_client)
):
    consommations = db.query(Consommation).filter(Consommation.id_client == current_client.id).all()
    if not consommations:
        raise HTTPException(status_code=404, detail="Aucune consommation trouvée")

    modele = (
        db.query(Deeplearning)
        .filter(Deeplearning.id_deeplearning == current_client.id_deeplearning)
        .first()
    )
    if not modele or not modele.modele_path:
        raise HTTPException(status_code=404, detail="Modèle non trouvé ou chemin manquant")

    if not os.path.exists(modele.modele_path):
        raise HTTPException(status_code=404, detail="Fichier du modèle introuvable sur le disque")

    # Chargement du modèle GRU enregistré
    model = load_model(modele.modele_path)

    # Préparation des données
    data = {
        "mois": [c.mois for c in consommations],
        "annee": [c.annee for c in consommations],
        "valeur": [c.valeur for c in consommations],
    }
    df = pd.DataFrame(data)
    df["date"] = pd.to_datetime(df["annee"].astype(str) + "-" + df["mois"].astype(str).str.zfill(2))
    df["month"] = df["date"].dt.month
    df["month_sin"] = np.sin(2 * np.pi * df["month"] / 12)
    df["month_cos"] = np.cos(2 * np.pi * df["month"] / 12)

    sequence_length = modele.time_step or 12
    if len(df) < sequence_length + 3:
        raise HTTPException(status_code=400, detail="Pas assez de données pour la prédiction")

    # Normalisation
    scaler = MinMaxScaler()
    features = ["valeur", "month_sin", "month_cos"]
    scaled = scaler.fit_transform(df[features])
    last_input = scaled[-sequence_length:]

    # Prédictions futures sur 3 mois
    future_preds = []
    future_date = df["date"].iloc[-1]
    for _ in range(3):
        pred_input = last_input.reshape(1, sequence_length, 3)
        pred_scaled = model.predict(pred_input, verbose=0)[0][0]

        future_date += relativedelta(months=1)
        mois = future_date.month
        annee = future_date.year
        sin = np.sin(2 * np.pi * mois / 12)
        cos = np.cos(2 * np.pi * mois / 12)
        last_input = np.vstack([last_input[1:], [pred_scaled, sin, cos]])

        pred_val = scaler.inverse_transform([[pred_scaled, sin, cos]])[0][0]
        future_preds.append({
            "mois": mois,
            "annee": annee,
            "prediction": round(pred_val, 2)
        })

    # MAPE sur les 3 derniers mois
    if len(scaled) < sequence_length + 3:
        mape = None
    else:
        X_test, y_test = [], []
        for i in range(len(scaled) - sequence_length - 3, len(scaled) - 3):
            if i + sequence_length >= len(scaled):
                continue
            X_test.append(scaled[i:i + sequence_length])
            y_test.append(scaled[i + sequence_length][0])
        X_test = np.array(X_test)
        y_test = np.array(y_test)

        if len(X_test) == 0:
            mape = None
        else:
            y_pred_scaled = model.predict(X_test, verbose=0).flatten()
            y_pred = scaler.inverse_transform(
                np.hstack([y_pred_scaled.reshape(-1, 1), X_test[:, -1, 1:]])
            )[:, 0]
            y_true = df["valeur"].values[-3:]
            mape = mean_absolute_percentage_error(y_true, y_pred)

    # Format de sortie
    resultats = [
        {
            "mois": conso.mois,
            "annee": conso.annee,
            "valeur": conso.valeur,
        }
        for conso in consommations[-9:]
    ]
   
    return {
        "consommations": resultats,
        "predictions": future_preds,
        "mape": round(mape * 100, 2) if mape is not None else None
    }








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
                "mois": res.mois,
                "annee": res.annee,
                "valeur": res.valeur
            })

    return result

