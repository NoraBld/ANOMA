from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Prediction, Resultat, Consommation

router = APIRouter()

@router.get("/comparaison_prediction_reel")
def comparaison_prediction_reel(db: Session = Depends(get_db)):
    try:
        # 🔁 Parcourir toutes les prédictions, de la plus récente à la plus ancienne
        predictions = db.query(Prediction).order_by(Prediction.date_creation.desc()).all()

        for prediction in predictions:
            resultats = db.query(Resultat).filter_by(id_prediction=prediction.id_prediction).all()
            if not resultats:
                continue  # skip si aucune prédiction associée

            # ✅ Vérifier qu'au moins un mois de cette prédiction a des données réelles
            consommation_dispo = False
            for res in resultats:
                if db.query(Consommation).filter_by(mois=res.mois, annee=res.annee).first():
                    consommation_dispo = True
                    break

            if not consommation_dispo:
                continue  # pas de données réelles → on passe à la précédente

            # ✅ Construire le tableau final avec tous les mois de la prédiction
            comparaison = []
            for res in resultats:
                mois = res.mois
                annee = res.annee
                date_str = f"{annee}-{mois:02d}"

                # Chercher les consommations pour ce mois/année
                consommations = db.query(Consommation).filter_by(mois=mois, annee=annee).all()
                valeur_reelle = None
                if consommations:
                    valeur_reelle = sum(c.valeur for c in consommations)

                comparaison.append({
                    "date": date_str,
                    "predicted": round(res.valeur, 2),
                    "real": round(valeur_reelle, 2) if valeur_reelle is not None else None
                })

            return comparaison  # ✅ Dès qu'une prédiction avec au moins un mois réel est trouvée

        # ❌ Si aucune prédiction avec au moins un mois réel n’est trouvée
        raise HTTPException(status_code=404, detail="Aucune prédiction avec données réelles trouvée.")

    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Erreur serveur : {str(e)}")