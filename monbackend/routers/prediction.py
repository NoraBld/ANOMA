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
            resultats = db.query(Exogene).order_by(Exogene.annee, Exogene.mois).all()
            for res in resultats:
                date_formatee = f"{res.mois:02d}/{res.annee}"
                valeur = res.valeur if res.valeur is not None else 0
                donnees_admin.append([date_formatee, valeur])

        elif nommethode == "SARIMA":
            resultats = db.query(Consommation).order_by(Consommation.annee, Consommation.mois).all()
            donnees_groupées = {}
            for res in resultats:
                cle = (res.annee, res.mois)
                valeur = res.valeur if res.valeur is not None else 0
                if cle in donnees_groupées:
                    donnees_groupées[cle] += valeur
                else:
                    donnees_groupées[cle] = valeur
            for (annee, mois), somme in sorted(donnees_groupées.items()):
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
            "aic_bestmodel": round(best_model["aic"], 2),
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
            "data_len": longueur_dataset,
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
        resultats = db.query(Consommation).order_by(Consommation.annee, Consommation.mois).all()


        donnees_groupées = {}
        for conso in resultats:
            cle = (conso.annee, conso.mois)
            valeur = conso.valeur if conso.valeur is not None else 0
            if cle in donnees_groupées:
                donnees_groupées[cle] += valeur
            else:
                donnees_groupées[cle] = valeur
        for (annee, mois), somme_valeurs in sorted(donnees_groupées.items()):
            donnees_admin.append([f"{annee}-{mois:02d}", somme_valeurs])

        

        df_main = pd.DataFrame(donnees_admin, columns=["datetime", "value"])
        longueur_dataset = len(donnees_admin)

        df_main["datetime"] = pd.to_datetime(df_main["datetime"], format="%Y-%m")
        df_main = df_main.sort_values("datetime").reset_index(drop=True)

        # 2) Récupération données exogènes historiques (températures)
        donnees_exog = []

# Récupère toutes les lignes de la table Exogene, triées par année et mois
        resultats = db.query(Exogene).order_by(Exogene.annee, Exogene.mois).all()

# Dictionnaire pour éviter les doublons (on garde une seule valeur par mois/année)
        exog_unique = {}

        for res in resultats:
            cle = (res.annee, res.mois)
            if cle not in exog_unique: 
                valeur = res.valeur if res.valeur is not None else 0
                exog_unique[cle] = valeur


        for (annee, mois), valeur in sorted(exog_unique.items()):
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





@router.post("/predict/gru")
async def predict_gru(periode: int = Form(...), nommethode: str = Form(...), db: Session = Depends(get_db)):
    try:
        # === Chargement données ===
        donnees_admin = []
        resultats = db.query(Consommation).order_by(Consommation.annee, Consommation.mois).all()


        donnees_groupées = {}
        for conso in resultats:
            cle = (conso.annee, conso.mois)
            valeur = conso.valeur if conso.valeur is not None else 0
            if cle in donnees_groupées:
                donnees_groupées[cle] += valeur
            else:
                donnees_groupées[cle] = valeur
        for (annee, mois), somme_valeurs in sorted(donnees_groupées.items()):
            donnees_admin.append([f"{annee}-{mois:02d}", somme_valeurs])


        df = pd.DataFrame(donnees_admin, columns=["date", "valeur"])

# Convertir la colonne "date" (ex: "01/2016") en datetime
        df["date"] = pd.to_datetime(df["date"], format="%Y-%m")


# Extraire mois et année si besoin
        df["month"] = df["date"].dt.month
        df["year"] = df["date"].dt.year

        df["quarter"] = df["date"].dt.quarter
        df["month_sin"] = np.sin(2 * np.pi * df["month"] / 12)
        df["month_cos"] = np.cos(2 * np.pi * df["month"] / 12)
        df["quarter_sin"] = np.sin(2 * np.pi * df["quarter"] / 4)
        df["quarter_cos"] = np.cos(2 * np.pi * df["quarter"] / 4)
        df["is_winter"] = df["month"].isin([12, 1, 2]).astype(int)
        df["is_summer"] = df["month"].isin([6, 7, 8]).astype(int)
        df["moving_avg"] = df["valeur"].rolling(window=3).mean().fillna(method="bfill")
        df["lag_1"] = df["valeur"].shift(1).fillna(method="bfill")
        df["lag_3"] = df["valeur"].shift(3).fillna(method="bfill")

        scaler_val = MinMaxScaler()
        df["valeur_scaled"] = scaler_val.fit_transform(df[["valeur"]])
        df["year_scaled"] = MinMaxScaler().fit_transform(df[["year"]])
        df["moving_avg_scaled"] = MinMaxScaler().fit_transform(df[["moving_avg"]])
        df["lag_1_scaled"] = MinMaxScaler().fit_transform(df[["lag_1"]])
        df["lag_3_scaled"] = MinMaxScaler().fit_transform(df[["lag_3"]])

        features_cols = [
            "valeur_scaled", "month_sin", "month_cos", "quarter_sin", "quarter_cos",
            "is_winter", "is_summer", "year_scaled", "moving_avg_scaled",
            "lag_1_scaled", "lag_3_scaled"
        ]
        features = df[features_cols].values
        target = df["valeur_scaled"].values

        def create_sequences(features, targets, look_back):
            X, y = [], []
            for i in range(len(features) - look_back):
                X.append(features[i:i + look_back])
                y.append(targets[i + look_back])
            return np.array(X), np.array(y)

        def mape(y_true, y_pred): return np.mean(np.abs((y_true - y_pred) / y_true)) * 100
        def smape(y_true, y_pred): return 100 * np.mean(2 * np.abs(y_pred - y_true) / (np.abs(y_true) + np.abs(y_pred)))
        def mae(y_true, y_pred): return np.mean(np.abs(y_true - y_pred))
        def rmse(y_true, y_pred): return np.sqrt(np.mean((y_true - y_pred) ** 2))

        look_back = 10
        X_train, y_train = create_sequences(features, target, look_back)

        import optuna
        from tensorflow.keras.models import Sequential
        from tensorflow.keras.layers import Input, GRU, Dense, Dropout
        from tensorflow.keras.optimizers import Adam

        def objective(trial):
            model = Sequential([
                Input(shape=(look_back, len(features_cols))),
                GRU(trial.suggest_int("units1", 32, 128), return_sequences=True),
                GRU(trial.suggest_int("units2", 32, 128), return_sequences=True),
                GRU(trial.suggest_int("units3", 32, 128)),
                Dropout(trial.suggest_float("dropout", 0.1, 0.5)),
                Dense(1)
            ])
            model.compile(optimizer=Adam(), loss="mean_squared_error")
            model.fit(
                X_train, y_train,
                epochs=trial.suggest_int("epochs", 50, 150),
                batch_size=trial.suggest_categorical("batch_size", [8, 16, 32]),
                verbose=0
            ) 
            y_pred = model.predict(X_train)
            y_pred_inv = scaler_val.inverse_transform(y_pred)
            y_true_inv = scaler_val.inverse_transform(y_train.reshape(-1, 1))
            return mape(y_true_inv, y_pred_inv)

        study = optuna.create_study(direction="minimize")
        study.optimize(objective, n_trials=10)
        best_params = study.best_params

        model = Sequential([
            Input(shape=(look_back, len(features_cols))),
            GRU(best_params["units1"], return_sequences=True),
            GRU(best_params["units2"], return_sequences=True),
            GRU(best_params["units3"]),
            Dropout(best_params["dropout"]),
            Dense(1)
        ])
        model.compile(optimizer=Adam(), loss="mean_squared_error")
        model.fit(X_train, y_train, epochs=best_params["epochs"], batch_size=best_params["batch_size"], verbose=0)

        y_pred = model.predict(X_train)
        y_pred_inv = scaler_val.inverse_transform(y_pred)
        y_true_inv = scaler_val.inverse_transform(y_train.reshape(-1, 1))

        last_seq = features[-look_back:]
        future_preds = []
        future_dates = pd.date_range(df["date"].iloc[-1] + pd.DateOffset(months=1), periods=periode, freq='MS')
        for date in future_dates:
            month = date.month
            quarter = ((month - 1) // 3) + 1
            sin_m, cos_m = np.sin(2 * np.pi * month / 12), np.cos(2 * np.pi * month / 12)
            sin_q, cos_q = np.sin(2 * np.pi * quarter / 4), np.cos(2 * np.pi * quarter / 4)
            is_winter = int(month in [12, 1, 2])
            is_summer = int(month in [6, 7, 8])
            year_scaled = df["year_scaled"].iloc[-1]
            last_val = future_preds[-1] if future_preds else y_pred[-1][0]
            lag_1, lag_3 = last_val, future_preds[-3] if len(future_preds) >= 3 else last_val
            moving_avg = np.mean(future_preds[-3:]) if len(future_preds) >= 3 else last_val

            input_vector = [
                last_val, sin_m, cos_m, sin_q, cos_q,
                is_winter, is_summer, year_scaled,
                df["moving_avg_scaled"].mean(), df["lag_1_scaled"].mean(), df["lag_3_scaled"].mean()
            ]
            input_seq = np.vstack([last_seq[1:], input_vector])
            input_seq = input_seq.reshape(1, look_back, len(features_cols))

            pred = model.predict(input_seq)[0, 0]
            future_preds.append(pred)
            last_seq = input_seq[0]

        future_preds_inv = scaler_val.inverse_transform(np.array(future_preds).reshape(-1, 1)).flatten()
        future_dates_str = [date.strftime("%Y-%m") for date in future_dates]
        dates_test = df["date"].iloc[look_back:look_back + len(y_true_inv)]
        dates_test_str = dates_test.dt.strftime("%Y-%m").tolist()


        best_params["time_step"] = look_back
        best_params["loss"] = "mean_squared_error (mse)"
        best_params["learning_rate"] = 0.001
        best_params["split_ratio"] = 1.0

        return JSONResponse(content={
            "message": "Prédiction GRU effectuée avec succès",
            "nom_de_la_methode": nommethode,
            "meilleur_essai": study.best_trial.number,
            "meilleurs_parametres": {
                **best_params,
                "taux_erreur_rmse": round(rmse(y_true_inv, y_pred_inv), 4),
                "taux_erreur_mae": round(mae(y_true_inv, y_pred_inv), 4),
                "taux_erreur_smape": round(smape(y_true_inv, y_pred_inv), 4)
            },
            "data_len": len(donnees_admin),
            "taux_erreur_mape": round(mape(y_true_inv, y_pred_inv), 2),
            "dates": future_dates_str,
            "valeurs": future_preds_inv.tolist(),
            "donnee_admin": donnees_admin,
            "valeurs_reelles_test": y_true_inv.flatten().tolist(),
            "valeurs_predites_test": y_pred_inv.flatten().tolist(),
            "dates_test_reelles": dates_test_str,
            "dates_test_predites": dates_test_str  # identiques car alignées
        })
    except Exception as e:
        import traceback
        traceback.print_exc()
        return JSONResponse(status_code=500, content={"message": f"Erreur lors de la prédiction : {str(e)}"})