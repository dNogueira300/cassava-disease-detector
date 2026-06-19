#!/usr/bin/env bash
# Arranque del contenedor backend: descarga los modelos desde Hugging Face
# (si HF_REPO está definida) y luego levanta uvicorn con el puerto dinámico.
# Se ejecuta con WORKDIR = /app/backend, donde `src` es importable.
set -e

python -m src.download_models

exec uvicorn src.main:app --host 0.0.0.0 --port "${PORT:-8080}"
