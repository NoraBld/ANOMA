import io
import pandas as pd
import numpy as np
from itertools import product
from fastapi import APIRouter, UploadFile, File, Form
from fastapi.responses import JSONResponse
from statsmodels.tsa.statespace.sarimax import SARIMAX
from sklearn.metrics import mean_absolute_percentage_error
import warnings
import torch
import torch.nn as nn
from sklearn.preprocessing import MinMaxScaler
from torch.utils.data import TensorDataset, DataLoader
from sklearn.metrics import mean_absolute_error, mean_squared_error
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import GRU, Dense, Dropout, Input
from tensorflow.keras.optimizers import Adam
import math
import os
import tensorflow as tf
import random
from itertools import product
from tensorflow.keras.callbacks import EarlyStopping
import optuna
from sklearn.preprocessing import StandardScaler


from sqlalchemy.orm import Session
from models import Consommation, Exogene
from fastapi import Depends
from database import get_db  
import pmdarima as pm





router = APIRouter()
        
        
       
        

from pydantic import BaseModel
from typing import List

router = APIRouter()
warnings.filterwarnings("ignore")

@router.post("/predict/sarima")
async def lancer_prediction(
    periode: int = Form(...),
    nommethode: str = Form(...),
    db: Session = Depends(get_db)
):
    try:
        donnees_admin = []
        if nommethode == "SARIMAX":
            for annee in range(2016, 2020):
                for mois in range(1, 13):
                    result = db.query(Exogene).filter(
                        Exogene.annee == annee,
                        Exogene.mois == mois
                    ).first()
                    valeur = result.valeur if result and result.valeur is not None else 0
                    donnees_admin.append([f"{mois:02d}/{annee}", valeur])

        elif nommethode == "SARIMA":
            for annee in range(2016, 2020):
                for mois in range(1, 13):
                    result = db.query(Consommation).filter(
                        Consommation.annee == annee,
                        Consommation.mois == mois
                    ).all()
                    somme = sum([r.valeur if r.valeur is not None else 0 for r in result])
                    donnees_admin.append([f"{mois:02d}/{annee}", somme])
        else:
            return JSONResponse(status_code=400, content={"message": "Méthode inconnue."})

        # Préparation des données
        df = pd.DataFrame(donnees_admin, columns=["datetime", "value"])
        longueur_dataset = len(donnees_admin)

        df["datetime"] = pd.to_datetime(df["datetime"], format="%m/%Y")
        df.set_index("datetime", inplace=True)
        df = df.asfreq("MS")
        train = df.iloc[:-6]
        val = df.iloc[-6:]

        # Paramètres à tester
        d = 1
        D = 0
        all_models = []

        for p in range(0, 2):
            for q in range(0, 2):
                for P in range(0, 2):
                    for Q in range(0, 2):
                        order = (p, d, q)
                        seasonal_order = (P, D, Q, 12)
                        try:
                            model = SARIMAX(
                                train["value"],
                                order=order,
                                seasonal_order=seasonal_order,
                                enforce_stationarity=False,
                                enforce_invertibility=False
                            )
                            results = model.fit(disp=False)

                            pred = results.predict(start=val.index[0], end=val.index[-1])
                            aic = results.aic
                            mse = mean_squared_error(val["value"], pred)
                            rmse = np.sqrt(mse)
                            mape = mean_absolute_percentage_error(val["value"], pred)

                            all_models.append({
                                "order": order,
                                "seasonal_order": seasonal_order,
                                "aic": aic,
                                "rmse": rmse,
                                "mape": mape
                            })
                        except:
                            continue

        if not all_models:
            return JSONResponse(status_code=500, content={"message": "Aucun modèle SARIMA valide trouvé."})

        # Trier par AIC croissant et sélectionner les 10 meilleurs
        all_models_sorted = sorted(all_models, key=lambda x: x["aic"])
        top_models = all_models_sorted[:10]

        # Choisir le meilleur selon le plus petit MAPE parmi les 10 meilleurs AIC
        best_model = min(top_models, key=lambda x: x["mape"])
        best_order = best_model["order"]
        best_seasonal_order = best_model["seasonal_order"]

        # Réentraînement complet avec le meilleur modèle
        final_model = SARIMAX(
            df["value"],
            order=best_order,
            seasonal_order=best_seasonal_order,
            enforce_stationarity=False,
            enforce_invertibility=False
        )
        final_result = final_model.fit(disp=False)

        forecast_index = pd.date_range(
            start=df.index[-1] + pd.DateOffset(months=1),
            periods=periode,
            freq="MS"
        )
        forecast = final_result.predict(start=forecast_index[0], end=forecast_index[-1])

        return JSONResponse(content={
            "message": "Prédiction SARIMA réussie",
            "nom_de_la_methode": nommethode,
            "meilleurs_parametres": {
                "p": best_order[0], "d": best_order[1], "q": best_order[2],
                "P": best_seasonal_order[0], "D": best_seasonal_order[1],
                "Q": best_seasonal_order[2], "saison": best_seasonal_order[3]
            },
            "taux_erreur_mape": round(best_model["mape"] * 100, 2),
            "aic_bestmodel":round(best_model["aic"], 2),
            "top_10_modeles": [
                {
                    "order": m["order"],
                    "seasonal_order": m["seasonal_order"],
                    "aic": round(m["aic"], 2),
                    "mape": round(m["mape"] * 100, 2),
                    "rmse": round(m["rmse"], 2)
                } for m in top_models
            ],
            "dates": forecast_index.strftime("%Y-%m").tolist(),
            "data_len":longueur_dataset,
            
            "valeurs": forecast.tolist(),
            "donnee_admin": donnees_admin
        })

    except Exception as e:
        import traceback
        traceback.print_exc()
        return JSONResponse(status_code=500, content={"message": f"Erreur : {str(e)}"})




@router.post("/predict/sarimax")
async def predict_sarimax(
    dates: list[str] = Form(...),
    valeurs: list[float] = Form(...),
    nommethode: str = Form(...),
    periode: int = Form(...),
    db: Session = Depends(get_db)
):
    try:
        # 1) Récupération données principales historiques (Consommation)
        donnees_admin = []
        for annee in range(2016, 2020):
            for mois in range(1, 13):
                result = (
                    db.query(Consommation)
                    .filter(Consommation.annee == annee, Consommation.mois == mois)
                    .all()
                )
                somme_valeurs = sum([conso.valeur if conso.valeur is not None else 0 for conso in result])
                donnees_admin.append([f"{annee}-{mois:02d}", somme_valeurs])  # format ISO "YYYY-MM"

        df_main = pd.DataFrame(donnees_admin, columns=["datetime", "value"])
        longueur_dataset = len(donnees_admin)

        df_main["datetime"] = pd.to_datetime(df_main["datetime"], format="%Y-%m")
        df_main = df_main.sort_values("datetime").reset_index(drop=True)

        # 2) Récupération données exogènes historiques (températures)
        donnees_exog = []
        for annee in range(2016, 2020):
            for mois in range(1, 13):
                result = (
                    db.query(Exogene)
                    .filter(Exogene.annee == annee, Exogene.mois == mois)
                    .first()
                )
                valeur = result.valeur if result and result.valeur is not None else 0
                donnees_exog.append([f"{annee}-{mois:02d}", valeur])

        df_exog = pd.DataFrame(donnees_exog, columns=["datetime", "exog"])
        df_exog["datetime"] = pd.to_datetime(df_exog["datetime"], format="%Y-%m")
        df_exog = df_exog.sort_values("datetime").reset_index(drop=True)

        # Vérifier alignement dates
        if not df_main["datetime"].equals(df_exog["datetime"]):
            raise ValueError("Les dates des données principales et exogènes historiques ne correspondent pas.")

        # --- Création variables exogènes enrichies ---
        df_exog['temp_min'] = df_exog['exog'] - 5  # exemple simple
        df_exog['temp_max'] = df_exog['exog'] + 5

        df_exog['month'] = df_exog['datetime'].dt.month
        df_exog['sin_month'] = np.sin(2 * np.pi * df_exog['month'] / 12)
        df_exog['cos_month'] = np.cos(2 * np.pi * df_exog['month'] / 12)

        df_exog['exog_lag1'] = df_exog['exog'].shift(1).fillna(method='bfill')
        df_exog['temp_diff'] = df_exog['exog'] - df_exog['exog_lag1']

        exog_features = ['exog', 'temp_min', 'temp_max', 'sin_month', 'cos_month', 'exog_lag1', 'temp_diff']
        exog_final = df_exog[exog_features]

        serie = df_main["value"]
        exog = exog_final

        # 4) Split train/test (80/20)
        train_size = int(len(serie) * 0.8)
        train, test = serie[:train_size], serie[train_size:]
        exog_train, exog_test = exog.iloc[:train_size], exog.iloc[train_size:]

        # 5) Grid Search paramètres SARIMAX
        p = d = q = range(0, 3)
        P = D = Q = range(0, 2)
        pdq = list(product(p, d, q))
        seasonal_pdq = [(x[0], x[1], x[2], 12) for x in product(P, D, Q)]

        best_mape = float("inf")
        best_model = None
        best_params = None
        best_results = None
        top_models = []

        for param in pdq:
            for seasonal_param in seasonal_pdq:
                try:
                    model = SARIMAX(
                        train,
                        exog=exog_train,
                        order=param,
                        seasonal_order=seasonal_param,
                        enforce_stationarity=False,
                        enforce_invertibility=False
                    )
                    results = model.fit(disp=False)
                    pred = results.predict(start=len(train), end=len(train) + len(test) - 1, exog=exog_test)

                    if np.any(test == 0):
                        continue

                    mape = mean_absolute_percentage_error(test, pred)
                    top_models.append({
                        "p": param[0], "d": param[1], "q": param[2],
                        "P": seasonal_param[0], "D": seasonal_param[1],
                        "Q": seasonal_param[2], "saison": seasonal_param[3],
                        "mape": round(mape * 100, 2)
                    })

                    if mape < best_mape:
                        best_mape = mape
                        best_model = results
                        best_params = (param, seasonal_param)
                        best_results = results

                except Exception:
                    continue

        top_models = sorted(top_models, key=lambda x: x["mape"])[:10]

        # 6) Création données exogènes futures enrichies à partir des températures futures fournies (valeurs)
        df_future_exog = pd.DataFrame(valeurs, columns=['exog'])
        df_future_exog['temp_min'] = df_future_exog['exog'] - 5
        df_future_exog['temp_max'] = df_future_exog['exog'] + 5
        df_future_exog['month'] = [(df_main["datetime"].iloc[-1] + pd.DateOffset(months=i+1)).month for i in range(periode)]
        df_future_exog['sin_month'] = np.sin(2 * np.pi * df_future_exog['month'] / 12)
        df_future_exog['cos_month'] = np.cos(2 * np.pi * df_future_exog['month'] / 12)
        df_future_exog['exog_lag1'] = df_future_exog['exog'].shift(1).fillna(method='bfill')  # pas parfait mais simple
        df_future_exog['temp_diff'] = df_future_exog['exog'] - df_future_exog['exog_lag1']

        future_exog = df_future_exog[exog_features]

        # 7) Prédiction future avec SARIMAX + exogènes enrichies
        forecast = best_model.forecast(steps=periode, exog=future_exog)

        forecast_dates = pd.date_range(
            start=df_main["datetime"].iloc[-1] + pd.DateOffset(months=1),
            periods=periode,
            freq='M'
        )

        return JSONResponse(content={
            "message": "Prédiction SARIMAX effectuée avec succès",
            "nom_de_la_methode": nommethode,
            "meilleurs_parametres": {
                "p": best_params[0][0], "d": best_params[0][1], "q": best_params[0][2],
                "P": best_params[1][0], "D": best_params[1][1],
                "Q": best_params[1][2], "saison": best_params[1][3]
            },
            "criteres_information": {
                "AIC": round(best_results.aic, 2),
                "BIC": round(best_results.bic, 2)
            },
            "taux_erreur_mape": round(best_mape * 100, 2),
            "data_len":longueur_dataset,
            "aic_bestmodel":round(best_results.aic, 2),


            "dates": forecast_dates.strftime("%Y-%m").tolist(),
            "valeurs": forecast.tolist(),
            "top_10_modeles": top_models
        })

    except Exception as e:
        import traceback
        traceback.print_exc()
        return JSONResponse(status_code=500, content={
            "message": f"Erreur lors de la prédiction : {str(e)}"
        })









# Fonctions utilitaires
def create_sequences(features, targets, time_step):
    X, Y = [], []
    for i in range(len(features) - time_step):
        X.append(features[i:i + time_step])
        Y.append(targets[i + time_step])
    return np.array(X), np.array(Y)

def build_gru_model(input_shape, units, dropout, learning_rate, loss):
    model = Sequential()
    model.add(GRU(units, return_sequences=True, input_shape=input_shape))
    model.add(GRU(units))
    model.add(Dropout(dropout))
    model.add(Dense(1))
    model.compile(optimizer=Adam(learning_rate=learning_rate), loss=loss)
    return model

def evaluate_model(model, X_test, Y_test, scaler):
    predictions = model.predict(X_test, verbose=0)
    Y_test_inv = scaler.inverse_transform(Y_test.reshape(-1, 1))
    predictions_inv = scaler.inverse_transform(predictions)

    rmse = np.sqrt(mean_squared_error(Y_test_inv, predictions_inv))
    mae = mean_absolute_error(Y_test_inv, predictions_inv)
    mape = np.mean(np.abs((Y_test_inv - predictions_inv) / Y_test_inv))
    denominator = (np.abs(Y_test_inv) + np.abs(predictions_inv)) / 2.0
    smape = np.mean(np.abs(Y_test_inv - predictions_inv) / denominator)

    return rmse, mae, mape, smape, Y_test_inv.flatten(), predictions_inv.flatten()
def objective(trial, features, targets, scaler):
    time_step = trial.suggest_int("time_step", 6, 24)
    split_ratio = trial.suggest_float("split_ratio", 0.6, 0.9)
    units = trial.suggest_categorical("units", [32, 64, 128])
    dropout = trial.suggest_float("dropout", 0.1, 0.5)
    learning_rate = trial.suggest_loguniform("learning_rate", 1e-4, 1e-2)
    batch_size = trial.suggest_categorical("batch_size", [8, 16, 32])
    epochs = trial.suggest_int("epochs", 20, 100)
    loss = trial.suggest_categorical("loss", ["mse", "mae"])
    patience = trial.suggest_int("patience", 5, 15)

    X, Y = create_sequences(features, targets, time_step)
    split = int(len(X) * split_ratio)
    X_train, Y_train = X[:split], Y[:split]
    X_val, Y_val = X[split:], Y[split:]

    model = build_gru_model(
        input_shape=(time_step, features.shape[1]),
        units=units,
        dropout=dropout,
        learning_rate=learning_rate,
        loss=loss
    )

    early_stopping = EarlyStopping(monitor="val_loss", patience=patience, restore_best_weights=True)

    model.fit(X_train, Y_train,
              validation_data=(X_val, Y_val),
              epochs=epochs,
              batch_size=batch_size,
              callbacks=[early_stopping],
              verbose=0)

    _, _, mape, _, _, _ = evaluate_model(model, X_val, Y_val, scaler)
    return mape
@router.post("/predict/gru")
async def predict_gru(periode: int = Form(...), nommethode: str = Form(...), db: Session = Depends(get_db)):
    try:
        donnees_admin = []
        for annee in range(2016, 2020):
            for mois in range(1, 13):
                result = db.query(Consommation).filter(Consommation.annee == annee, Consommation.mois == mois).all()
                somme_valeurs = sum([conso.valeur or 0 for conso in result])
                donnees_admin.append([f"{mois:02d}/{annee}", somme_valeurs])

        df = pd.DataFrame(donnees_admin, columns=["datetime", "value"])
        longueur_dataset = len(donnees_admin)

        df["datetime"] = pd.to_datetime(df["datetime"], format="%m/%Y")
        df = df.sort_values("datetime")
        df["month"] = df["datetime"].dt.month
        df["year"] = df["datetime"].dt.year
        df["month_sin"] = np.sin(2 * np.pi * df["month"] / 12)
        df["month_cos"] = np.cos(2 * np.pi * df["month"] / 12)
        df["year_norm"] = (df["year"] - df["year"].min()) / (df["year"].max() - df["year"].min())
        df["season"] = df["month"] % 12 // 3 + 1
        df["season_sin"] = np.sin(2 * np.pi * df["season"] / 4)
        df["season_cos"] = np.cos(2 * np.pi * df["season"] / 4)

        scaler = MinMaxScaler()
        df["scaled_value"] = scaler.fit_transform(df[["value"]])
        features = df[["scaled_value", "month_sin", "month_cos", "year_norm", "season_sin", "season_cos"]].values

        study = optuna.create_study(direction="minimize")
        func = lambda essai: objective(essai, features, df["scaled_value"].values, scaler)
        study.optimize(func, n_trials=5)
        best_params = study.best_trial.params

        X, Y = create_sequences(features, df["scaled_value"].values, best_params["time_step"])
        split = int(len(X) * best_params["split_ratio"])
        X_train, Y_train = X[:split], Y[:split]
        X_test, Y_test = X[split:], Y[split:]

        input_shape = (X_train.shape[1], X_train.shape[2])
        model = build_gru_model(
            input_shape=input_shape,
            units=best_params["units"],
            dropout=best_params["dropout"],
            learning_rate=best_params["learning_rate"],
            loss=best_params["loss"]
        )
        early_stopping = EarlyStopping(monitor="val_loss", patience=best_params["patience"], restore_best_weights=True)
        model.fit(X_train, Y_train,
                  validation_data=(X_test, Y_test),
                  epochs=best_params["epochs"],
                  batch_size=best_params["batch_size"],
                  callbacks=[early_stopping],
                  verbose=0)

        rmse, mae, mape, smape, _, _ = evaluate_model(model, X_test, Y_test, scaler)

        # Génération des prédictions futures
        future_predictions = []
        last_sequence = features[-best_params["time_step"]:]
        last_date = df["datetime"].iloc[-1]

        for _ in range(periode):
            input_seq = last_sequence.reshape(1, *input_shape)
            next_scaled = model.predict(input_seq, verbose=0)[0][0]
            future_predictions.append(next_scaled)

            next_date = last_date + pd.DateOffset(months=1)
            next_month = next_date.month
            next_year = next_date.year
            next_year_norm = (next_year - df["year"].min()) / (df["year"].max() - df["year"].min())
            next_season = next_month % 12 // 3 + 1
            next_point = np.array([
                next_scaled,
                np.sin(2 * np.pi * next_month / 12),
                np.cos(2 * np.pi * next_month / 12),
                next_year_norm,
                np.sin(2 * np.pi * next_season / 4),
                np.cos(2 * np.pi * next_season / 4)
            ])
            last_sequence = np.vstack([last_sequence[1:], next_point])
            last_date = next_date

        future_predictions_rescaled = scaler.inverse_transform(np.array(future_predictions).reshape(-1, 1))
        future_dates = pd.date_range(start=df["datetime"].iloc[-1] + pd.DateOffset(months=1), periods=periode, freq="MS")

        return JSONResponse(content={
            "message": "Prédiction GRU effectuée avec succès",
            "nom_de_la_methode": nommethode,
            "meilleur_essai": study.best_trial.number,
            "valeur_objectif_mape": round(study.best_trial.value * 100, 2),
            "meilleurs_parametres": {
                **best_params,
                "taux_erreur_rmse": round(rmse, 4),
                "taux_erreur_mae": round(mae, 4),
                "taux_erreur_smape": round(smape, 4)
            },
            
            "data_len":longueur_dataset,

            "taux_erreur_mape": round(mape * 100, 2),
            "dates": [d.strftime('%Y-%m') for d in future_dates],
            "valeurs": future_predictions_rescaled.flatten().tolist(),
            "donnee_admin": donnees_admin
        })

    except Exception as e:
        import traceback
        traceback.print_exc()
        return JSONResponse(status_code=500, content={"message": f"Erreur lors de la prédiction : {str(e)}"})



