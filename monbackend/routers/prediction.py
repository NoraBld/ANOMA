import pandas as pd
from fastapi import UploadFile, File, Form
from fastapi.responses import JSONResponse
from io import StringIO
import io

from fastapi import APIRouter

router = APIRouter()



# -------------afficher la periode et le nom du fichier csv------------
# @router.post("/predict")
# async def lancer_prediction(
   
#     periode: int = Form(...),
#     fichier: UploadFile = File(...)

#     # fichier: Optional[UploadFile] = File(None)
# ):
#     # Ici tu peux enregistrer le fichier temporairement
#     # contenu = await fichier.read()
# # : traiter le fichier et lancer la prédiction

#     return JSONResponse(content={
#         "message": "Prédiction lancée",
       
       
#         "periode": periode,
#         "nom_fichier": fichier.filename
#     })



# -------------afficher la periode et les donnees du fichier csv-------------
# @router.post("/predict")
# async def lancer_prediction(
#     periode: int = Form(...),
#     fichier: UploadFile = File(...)
# ):
#     # Lire le contenu du fichier CSV
#     contents = await fichier.read()
#     df = pd.read_csv(io.StringIO(contents.decode("utf-8")))

#     # Extraire les données
#     dates = df["Date"].tolist()
#     valeurs = df["Valeur"].tolist()

#     return JSONResponse(content={
#         "message": "Données extraites avec succès",
#         "dates": dates,
#         "valeurs": valeurs
#     })




from fastapi import APIRouter, UploadFile, File, Form
from fastapi.responses import JSONResponse
import pandas as pd
import io
from statsmodels.tsa.statespace.sarimax import SARIMAX

router = APIRouter()

@router.post("/predict")
async def lancer_prediction(
    periode: int = Form(...),
    fichier: UploadFile = File(...)
):
    try:
        # Lire le contenu du fichier CSV
        contents = await fichier.read()
        df = pd.read_csv(io.StringIO(contents.decode("utf-8")))

        # Convertir la colonne datetime en datetime
        df["datetime"] = pd.to_datetime(df["datetime"])
        df = df.sort_values("datetime")

        # Extraire la série temporelle
        serie = df["value"]

        # Créer le modèle SARIMA (paramètres simples pour test)
        model = SARIMAX(serie, order=(1, 1, 1), seasonal_order=(1, 1, 1, 24))
        results = model.fit(disp=False)

        # Faire la prédiction
        forecast = results.forecast(steps=periode)
        forecast_dates = pd.date_range(start=df["datetime"].iloc[-1] + pd.Timedelta(hours=1), periods=periode, freq='H')

        return JSONResponse(content={
            "message": "Prédiction SARIMA effectuée avec succès",
            "dates": forecast_dates.strftime("%Y-%m-%d %H:%M:%S").tolist(),
            "valeurs": forecast.tolist()
        })
    except Exception as e:
        return JSONResponse(status_code=500, content={
            "message": f"Erreur lors de la prédiction : {str(e)}"
        })
