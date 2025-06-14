from fastapi import APIRouter, HTTPException
from models import Client
from database import SessionLocal

router = APIRouter()

@router.get("/clients/by-code/{code_client}")
def get_client_by_code(code_client: int):
    db = SessionLocal()
    client = db.query(Client).filter(Client.codeClient == code_client).first()
    if not client:
        raise HTTPException(status_code=404, detail="Client non trouvé")
    return client
