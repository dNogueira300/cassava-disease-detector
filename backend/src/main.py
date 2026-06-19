"""
main.py — AmazoniaCrop API v2.0
Sistema multicultivo: Yuca + Plátano + Cacao
"""
import os
from contextlib import asynccontextmanager

from fastapi import FastAPI, File, UploadFile, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from src.router import predecir_por_cultivo, CULTIVOS_INFO
from src.download_models import asegurar_modelos, MODELOS, _ruta_destino


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Al arrancar: descarga los modelos desde Hugging Face si no están en disco.
    # Se ejecuta antes de atender la primera petición; los predictores cargan
    # los .pth de forma perezosa en la primera predicción, así que para entonces
    # los archivos ya estarán presentes.
    asegurar_modelos()
    yield


app = FastAPI(
    title="AmazoniaCrop API",
    description="Detección de enfermedades en cultivos amazónicos con IA",
    version="2.0.0",
    lifespan=lifespan,
)

# CORS configurable por entorno (coma-separado). Fallback a los puertos de
# desarrollo local de Vite/React.
cors_origins = os.getenv(
    "CORS_ORIGINS", "http://localhost:5173,http://localhost:3000"
)
allow_origins = [origin.strip() for origin in cors_origins.split(",") if origin.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def raiz():
    return {
        "sistema":  "AmazoniaCrop — Detección de Enfermedades",
        "version":  "2.0.0",
        "cultivos": list(CULTIVOS_INFO.keys()),
        "estado":   "activo",
    }


@app.get("/health")
def health():
    """Healthcheck para Railway: reporta si los 4 modelos están en disco."""
    modelos = {
        f"{cultivo}/{archivo}": os.path.exists(_ruta_destino(archivo, cultivo))
        for archivo, cultivo in MODELOS
    }
    todos_ok = all(modelos.values())
    return JSONResponse(
        status_code=200 if todos_ok else 503,
        content={
            "estado":  "ok" if todos_ok else "modelos_incompletos",
            "modelos": modelos,
        },
    )


@app.get("/cultivos")
def listar_cultivos():
    return {"cultivos": CULTIVOS_INFO}


@app.post("/analizar")
async def analizar(
    cultivo: str        = Form(...),
    imagen:  UploadFile = File(...),
):
    if not imagen.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="El archivo debe ser una imagen.")
    contenido = await imagen.read()
    try:
        resultado = predecir_por_cultivo(cultivo, contenido)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    return JSONResponse(content=resultado)


if __name__ == "__main__":
    # Arranque directo para desarrollo local: lee PORT del entorno (Railway lo
    # inyecta) con fallback a 8080. En el contenedor se usa el CMD del Dockerfile.
    import uvicorn

    port = int(os.getenv("PORT", "8080"))
    uvicorn.run("src.main:app", host="0.0.0.0", port=port, reload=False)
