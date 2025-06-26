from routers import  ajouterClient , modifierClient ,gruClient,recherche, rechercheClient , auth , client_profile ,exogene, consommation , adminProfile, graphepred, comparaison
from fastapi.staticfiles import StaticFiles



from fastapi import APIRouter, Request, Depends
from sqlalchemy.orm import Session
from fastapi.responses import JSONResponse
from datetime import date
from database import get_db
from models import Deeplearning, Statistique, Prediction, Resultat, Admin
from fastapi import HTTPException




from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
# from . import models, schemas
import models
import schemas
# from .database import SessionLocal, engine
from routers import prediction, modele
from routers import afficherprediction
from database import SessionLocal, engine
   # si tu exécutes sans structure de package
from fastapi.middleware.cors import CORSMiddleware



models.Base.metadata.create_all(bind=engine)

app = FastAPI()
app.include_router(prediction.router)
app.include_router(modele.router)



app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # ou "*" temporairement

    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/static", StaticFiles(directory="static"), name="static")
app.include_router(ajouterClient.router)
app.include_router(modifierClient.router)
app.include_router(rechercheClient.router)
app.include_router(auth.router)
app.include_router(client_profile.router)
app.include_router(consommation.router)
app.include_router(adminProfile.router)
app.include_router(graphepred.router)
app.include_router(recherche.router)
app.include_router(comparaison.router)
app.include_router(exogene.router)
app.include_router(gruClient.router)
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)

