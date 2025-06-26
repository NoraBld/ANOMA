from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from models import Consommation, Client, Deeplearning
from database import get_db

import pandas as pd
import numpy as np
from sklearn.preprocessing import MinMaxScaler
from sklearn.metrics import mean_absolute_percentage_error

from tensorflow.keras.models import Sequential, save_model
from tensorflow.keras.layers import GRU, Dense, Dropout
from tensorflow.keras.optimizers import Adam
import optuna

import os
import uuid

router = APIRouter()

# === Séquences ===
def create_sequences(df, seq_len, scaler):
    features = ["valeur", "month_sin", "month_cos"]
    scaled = scaler.fit_transform(df[features])
    X, y = [], []
    for i in range(len(scaled) - seq_len):
        X.append(scaled[i:i+seq_len])
        y.append(scaled[i+seq_len][0])
    return np.array(X), np.array(y)

# === Objectif Optuna ===
def objective(trial, clients_df, sequence_length):
    units1 = trial.suggest_categorical("units1", [64, 108])
    units2 = trial.suggest_categorical("units2", [64, 108])
    units3 = trial.suggest_categorical("units3", [64, 108])

    X_all, y_all = [], []
    for df in clients_df:
        scaler = MinMaxScaler()
        X_seq, y_seq = create_sequences(df, sequence_length, scaler)
        X_all.append(X_seq)
        y_all.append(y_seq)

    X_train = np.concatenate(X_all)
    y_train = np.concatenate(y_all)

    model = Sequential([
        GRU(units1, return_sequences=True, input_shape=(sequence_length, 3)),
        Dropout(0.2),
        GRU(units2, return_sequences=True),
        GRU(units3),
        Dense(1)
    ])
    model.compile(loss='mse', optimizer=Adam(learning_rate=0.001))
    model.fit(X_train, y_train, epochs=100, batch_size=16, verbose=0)

    # Sauvegarde temporaire du modèle dans le trial
    trial.set_user_attr("trained_model", model)

    total_mape, count = 0, 0
    for df in clients_df:
        df_test = df[-(sequence_length + 12):]
        scaler = MinMaxScaler()
        X_test, y_test = create_sequences(df_test, sequence_length, scaler)
        if len(X_test) == 0:
            continue
        y_pred_scaled = model.predict(X_test, verbose=0).flatten()
        y_pred = scaler.inverse_transform(
            np.hstack([y_pred_scaled.reshape(-1, 1), X_test[:, -1, 1:]])
        )[:, 0]
        y_true = df["valeur"].values[-12:]
        mape = mean_absolute_percentage_error(y_true, y_pred)
        total_mape += mape
        count += 1  

    return total_mape / count if count else float("inf")

# === Endpoint principal ===
@router.post("/predict/gru/global")
def optimize_gru_model(db: Session = Depends(get_db)):
    clients = db.query(Client).all()
    sequence_length = 12

    clients_df = []
    for client in clients:
        consommations = (
            db.query(Consommation)
            .filter(Consommation.id_client == client.id)
            .order_by(Consommation.annee, Consommation.mois)
            .all()
        )
        if len(consommations) < sequence_length + 12:
            continue

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
        clients_df.append(df)

    if not clients_df:
        return {"message": "Aucun client n'a assez de données pour l'entraînement."}

    # === Lancement Optuna
    study = optuna.create_study(direction="minimize")
    study.optimize(lambda trial: objective(trial, clients_df, sequence_length), n_trials=2)

    best_params = study.best_params
    best_score = study.best_value

    # === Sauvegarde du modèle entraîné ===
    best_model = study.best_trial.user_attrs["trained_model"]
    MODEL_DIR = "models_saved"
    os.makedirs(MODEL_DIR, exist_ok=True)
    model_filename = f"gru_model_{uuid.uuid4().hex}.keras"
    model_path = os.path.join(MODEL_DIR, model_filename)
    best_model.save(model_path)

    # === Enregistrement dans la base
    new_model = Deeplearning(
        units1=best_params["units1"],
        units2=best_params["units2"],
        units3=best_params["units3"],
        epochs=100,
        batch_size=16,
        time_step=sequence_length,
        patience=10,
        loss="mse",
        dropout=0.2,
        learning_rate=0.001,
        split_ratio=0.8,
        mape=round(best_score * 100, 2),
        modele_path=model_path  #  chemin du fichier sauvegardé
    )
    db.add(new_model)
    db.commit()
    db.refresh(new_model)

    # Mise à jour des clients
    for client in clients:
        client.id_deeplearning = new_model.id_deeplearning
    db.commit()

    return {
        "message": "Création du modèle et mise à jour des clients réussies.",
        "meilleur_modele": {
            "id_modele": new_model.id_deeplearning,
            "units1": new_model.units1,
            "units2": new_model.units2,
            "units3": new_model.units3,
            "epochs": new_model.epochs,
            "batch_size": new_model.batch_size,
            "mape_moyen": new_model.mape,
            "modele_path": new_model.modele_path
        }
    }
