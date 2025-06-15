# backend/routers/profil.py
from fastapi import APIRouter, UploadFile, File
from fastapi.responses import JSONResponse
import shutil
import os

router = APIRouter()

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@router.post("/upload-profile-pic")
async def upload_profile_pic(file: UploadFile = File(...)):
    file_location = f"{UPLOAD_FOLDER}/{file.filename}"
    with open(file_location, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    return JSONResponse(content={"filename": file.filename, "url": f"{file_location}"})
