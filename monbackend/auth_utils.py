from jose import JWTError, jwt
from datetime import datetime, timedelta
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from database import get_db
from models import Client, Admin

# Clé secrète à garder confidentielle
SECRET_KEY = "une_clé_secrète_très_longue_et_complexe_à_remplacer"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

# Le tokenUrl doit pointer vers l'endpoint de login commun
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login")


def create_access_token(data: dict, expires_delta: timedelta | None = None):
    """
    Génère un token JWT avec expiration.
    """
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def decode_access_token(token: str):
    """
    Décode un token JWT, retourne le payload ou None si invalide.
    """
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        return None


def get_current_client(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> Client:
    """
    Récupère le client actuel à partir du token.
    """
    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token invalide ou expiré",
            headers={"WWW-Authenticate": "Bearer"},
        )

    client_id = payload.get("sub")
    role = payload.get("role")

    if client_id is None or role == "admin":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token invalide pour un client")

    client = db.query(Client).filter(Client.id == int(client_id)).first()
    if client is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Client non trouvé")

    return client


def get_current_admin(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> Admin:
    """
    Récupère l'admin actuel à partir du token.
    """
    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token invalide ou expiré",
            headers={"WWW-Authenticate": "Bearer"},
        )

    admin_id = payload.get("sub")
    role = payload.get("role")

    if admin_id is None or role != "admin":

        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token invalide pour un client")

    admin = db.query(Admin).filter(Admin.id == int(admin_id)).first()
    if admin is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Admin non trouvé")

    return admin



