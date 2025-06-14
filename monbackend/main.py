from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

import models
from database import engine, SessionLocal
from routers import prediction, ajouterClient , modifierClient , rechercheClient , auth , client_profile , consommation , adminProfile
from fastapi.staticfiles import StaticFiles
models.Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Adresse du frontend React
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

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
