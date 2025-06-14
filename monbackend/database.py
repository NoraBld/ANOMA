
from sqlalchemy import Column, Integer, String, Float, Boolean, Date, ForeignKey, create_engine
from sqlalchemy.orm import relationship, sessionmaker, declarative_base

# Connexion PostgreSQL (à adapter selon ton mot de passe)
DATABASE_URL = "postgresql://postgres:anoma11@localhost:5432/anoma"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)
Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()