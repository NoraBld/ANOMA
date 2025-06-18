from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from database import get_db
from schemas import AdminOut
from models import Admin, Prediction
from auth_utils import get_current_admin
from utils import verify_password, hash_password
import shutil
import os

router = APIRouter(
    prefix="/admin",
    tags=["Admin Profil"]
)

# GET /admin/me : Récupérer les infos de l'admin connecté
@router.get("/me", response_model=AdminOut)
def read_admin_me(current_admin: Admin = Depends(get_current_admin)):
    return current_admin


@router.put("/update")
async def update_admin(
    logo: UploadFile = File(None),
    telephone: str = Form(...), 
    email: str = Form(...),
    secteur: str = Form(...),
    currentPassword: str = Form(None),
    newPassword: str = Form(None),
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin)
):
    admin = db.query(Admin).filter(Admin.id == current_admin.id).first()
    if not admin:
        raise HTTPException(status_code=404, detail="Admin non trouvé")

    admin.telephone = telephone
    admin.email = email
    admin.secteur = secteur

    # ✅ Vérification et mise à jour du mot de passe si demandé
    if currentPassword and newPassword:
        if not verify_password(currentPassword, admin.mot_de_passe):
            raise HTTPException(status_code=400, detail="Mot de passe actuel incorrect")
        admin.mot_de_passe = hash_password(newPassword)

    # ✅ Sauvegarde du logo si présent
    try:
        if logo:
            os.makedirs("static/logos", exist_ok=True)
            filename = f"{admin.id}_{logo.filename}"
            local_path = os.path.join("static", "logos", filename)
            public_url = f"/static/logos/{filename}"

            with open(local_path, "wb") as buffer:
                shutil.copyfileobj(logo.file, buffer)

            admin.logo = public_url

        db.commit()
        db.refresh(admin)

        return {
            "message": "Profil mis à jour",
            "admin": {
                "email": admin.email,
                "telephone": admin.telephone,
                "secteur": admin.secteur,
                "logo": admin.logo
            }
        }

    except Exception as e:
        print(f"Erreur lors de la mise à jour du profil : {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/prediction-dates")
def get_prediction_dates(
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin)
):
    dates = db.query(Prediction.date_creation).filter(Prediction.id_admin == current_admin.id).distinct().all()
    return [d[0] for d in dates]
