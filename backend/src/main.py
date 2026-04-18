"""
API FastAPI — Sistema de detección de enfermedades en yuca.
"""
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from src.predictor import predecir

app = FastAPI(title="Cassava Disease Detector API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def raiz():
    return {"estado": "activo", "modelo": "EfficientNet-B4", "cultivo": "Yuca (Manihot esculenta)"}

@app.post("/analizar")
async def analizar(imagen: UploadFile = File(...)):
    if not imagen.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="El archivo debe ser una imagen.")
    contenido = await imagen.read()
    resultado = predecir(contenido)
    return JSONResponse(content=resultado)
