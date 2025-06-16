from fastapi import APIRouter, Request, Depends
from sqlalchemy.orm import Session
from fastapi.responses import JSONResponse
from datetime import date
from database import get_db
from models import Deeplearning, Statistique, Prediction, Resultat, Admin
from fastapi import HTTPException


router = APIRouter()

@router.get("/affichage")
def affichage(db: Session = Depends(get_db)):
    try:
        last_prediction = (
            db.query(Prediction)
            .order_by(Prediction.date_creation.desc())
            .first()
        )

        if not last_prediction:
            return {"message": "Aucune prédiction disponible"}

        associated_results = (
            db.query(Resultat)
            .filter(Resultat.id_prediction == last_prediction.id_prediction)
            .all()
        )

        if not associated_results:
            return {"message": "Aucun résultat associé à la prédiction"}

        dates = [f"{res.annee}-{res.mois:02d}" for res in associated_results]
        valeurs = [res.valeur for res in associated_results]

        return {
            "dates": dates,
            "valeurs": valeurs,
            # "nom_de_la_methode": last_prediction.methode,
            "periode": last_prediction.periode,
            "data_len": len(valeurs)
        }

    except Exception as e:
        import traceback
        traceback.print_exc()
        return {"error": str(e)}



@router.post("/enregistrerModel")
async def enregistrer(request: Request, db: Session = Depends(get_db)):
    try:
        body = await request.json()
        print("BODY :", body)

        parametres = body.get("parametres", [])
        valeurs_liste = body.get("valeurs", [])

        if not parametres:
            return JSONResponse(status_code=400, content={"message": "Aucun paramètre fourni"})

        for val in valeurs_liste:
            periode = val.get("periode")
            liste_valeurs = val.get("Valeurs", [])  # Attention à la casse
            liste_dates = val.get("Date", [])
            longueur_dataset = val.get("len")

            for param in parametres:
                nommethode = param.get("nommethode")

                if nommethode == "GRU":
                    # Paramètres GRU
                    mape = param.get("erreur")
                    learning_rate = param.get("learning_rate")
                    units = param.get("units")
                    dropout = param.get("dropout")
                    epochs = param.get("epochs")
                    batch_size = param.get("batch_size")
                    time_step = param.get("time_step")
                    loss = param.get("loss")
                    patience = param.get("patience")
                    split_ratio = param.get("split_ratio")

                    # Insertion dans Deeplearning
                    new_dl = Deeplearning(
                        units=units,
                        epochs=epochs,
                        patience=patience,
                        batch_size=batch_size,
                        time_step=time_step,
                        loss=loss,
                        dropout=dropout,
                        split_ratio=split_ratio,
                        learning_rate=learning_rate,
                        mape=mape
                    )
                    db.add(new_dl)
                    db.commit()
                    db.refresh(new_dl)

                    # Insertion dans Prediction
                    new_pred = Prediction(
                        periode=periode,
                        date_creation=date.today(),
                        id_admin=1,
                        id_deeplearning=new_dl.id_deeplearning,
                        id_statistique=None
                    )
                    db.add(new_pred)
                    db.commit()
                    db.refresh(new_pred)

                else:
                    # Paramètres statistiques
                    mape = param.get("erreur")
                    P = param.get("P")
                    Q = param.get("Q")
                    D = param.get("D")
                    p = param.get("p")
                    q = param.get("q")
                    d = param.get("d")
                    aic = param.get("AIC")

                    # Insertion dans Statistique
                    new_stat = Statistique(
                        P=P,
                        Q=Q,
                        D=D,
                        p=p,
                        q=q,
                        d=d,
                        AIC=aic,
                        nom_methode=nommethode,
                        saisonalite=12,
                        mape=mape
                    )
                    db.add(new_stat)
                    db.commit()
                    db.refresh(new_stat)

                    # Insertion dans Prediction
                    new_pred = Prediction(
                        periode=periode,
                        date_creation=date.today(),
                        id_admin=1,
                        id_deeplearning=None,
                        id_statistique=new_stat.id_statistique
                    )
                    db.add(new_pred)
                    db.commit()
                    db.refresh(new_pred)

                # ✅ Insertion des résultats pour cette prédiction
                for valeur, d in zip(liste_valeurs, liste_dates):
                    annee, mois = map(int, d.split("-"))
                    new_result = Resultat(
                        mois=mois,
                        annee=annee,
                        valeur=valeur,
                        id_prediction=new_pred.id_prediction
                    )
                    db.add(new_result)
                    db.commit()


            # ✅ Mise à jour de l'admin en dehors de la boucle des paramètres
            admin = db.query(Admin).filter(Admin.id == 1).first()
            if admin:
                admin.taille_dataset = longueur_dataset

        db.commit()  # Un seul commit à la fin

        return JSONResponse(content={
            "message": "Enregistrement réussi",
            "nombre_enregistre": len(parametres),
            "valeurlist" : valeurs_liste
        })

    except Exception as e:
        import traceback
        traceback.print_exc()
        return JSONResponse(status_code=500, content={"message": f"Erreur : {str(e)}"})



