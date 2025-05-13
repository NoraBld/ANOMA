from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
# from . import models, schemas
import models
import schemas
# from .database import SessionLocal, engine
from routers import prediction
from database import SessionLocal, engine
   # si tu exécutes sans structure de package
from fastapi.middleware.cors import CORSMiddleware



models.Base.metadata.create_all(bind=engine)

app = FastAPI()
app.include_router(prediction.router)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # ou "*" temporairement
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
# @app.post("/utilisateur/", response_model=schemas.UtilisateurResponse)
# def creer_utilisateur(utilisateur: schemas.UtilisateurCreate, db: Session = Depends(get_db)):
#     db_user = models.Utilisateur(**utilisateur.dict())
#     db.add(db_user)
#     db.commit()
#     db.refresh(db_user)
#     return db_user

# @app.put("/utilisateur/{user_id}", response_model=schemas.UtilisateurResponse)
# def modifier_utilisateur(user_id: int, utilisateur: schemas.UtilisateurUpdate, db: Session = Depends(get_db)):
#     db_user = db.query(models.Utilisateur).filter(models.Utilisateur.id == user_id).first()
#     if not db_user:
#         raise HTTPException(status_code=404, detail="Utilisateur non trouvé")

#     for key, value in utilisateur.dict(exclude_unset=True).items():
#         setattr(db_user, key, value)

#     db.commit()
#     db.refresh(db_user)
#     return db_user
