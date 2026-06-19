# AmazoniaCrop — backend (FastAPI + PyTorch)
# IMPORTANTE: el contexto de build debe ser la RAÍZ del repositorio, no
# backend/, porque los predictores leen también assets/disease_info/*.json
# (carpeta hermana de backend/). En Railway: Root Directory = repo root y
# Dockerfile Path = backend/Dockerfile. Local:
#   docker build -f backend/Dockerfile -t amazonia-backend .
FROM python:3.11-slim

WORKDIR /app

# Dependencia de sistema para los kernels de PyTorch (OpenMP). El proyecto no
# usa OpenCV, así que no hacen falta libsm6/libxext6/libglib2.0-0.
RUN apt-get update && apt-get install -y --no-install-recommends \
        libgomp1 \
    && rm -rf /var/lib/apt/lists/*

# 1) torch + torchvision CPU-only PRIMERO, desde el índice de PyTorch, para no
#    arrastrar la variante CUDA (varios GB). Misma versión que requirements.txt,
#    así pip las da por satisfechas en el paso siguiente.
RUN pip install --no-cache-dir \
        torch==2.11.0 torchvision==0.22.0 \
        --index-url https://download.pytorch.org/whl/cpu

# 2) Resto de dependencias de producción.
COPY backend/requirements.txt /app/backend/requirements.txt
RUN pip install --no-cache-dir -r /app/backend/requirements.txt

# 3) Código del backend + assets. Los .pth NO se copian (los excluye
#    .dockerignore); se descargan en el arranque desde Hugging Face.
COPY backend/ /app/backend/
COPY assets/  /app/assets/

WORKDIR /app/backend

# Railway inyecta $PORT; en local cae a 8080. Documentativo (Railway lo ignora).
EXPOSE 8080

# Descarga modelos (si HF_REPO está definida) y arranca uvicorn.
CMD ["bash", "startup.sh"]
