# Cambios para Despliegue — AmazoniaCrop
Fecha: 2026-06-18
Base: implementación de los 11 puntos de `PREPARAR_DESPLIEGUE.md` sobre los hallazgos de `AUDITORIA_DESPLIEGUE.md`.
Arquitectura de modelos: los 4 `.pth` se sirven desde **Hugging Face Hub** (`DANCN/amazonia-crop-models`) y se descargan al arrancar el contenedor; **no se versionan en git ni LFS**.

> ⚠️ **No se hizo commit ni push.** Todo queda en el working directory para tu revisión.

---

## Resumen

El proyecto queda **listo para construir en Railway con Docker** (backend + frontend como servicios separados). El código ya no depende de los `.pth` en git: se descargan en el arranque si defines `HF_REPO`, y si no, asume que están en disco (dev local sigue funcionando igual). Lo que **falta es manual tuyo**: (1) subir los 4 modelos a Hugging Face, (2) crear los 2 servicios en Railway con el Root Directory correcto, (3) definir las variables de entorno listadas abajo. Detalle de verificación local al final.

Nota: en `git status` aparecen también `App.jsx`, `CropSelector.jsx`, `Hero.jsx`, `InfoSection.jsx` y `public/cacao.png|platano.png` como modificados/nuevos — **esos cambios son previos a esta sesión**, no los toqué.

---

## Archivos creados

| Ruta | Propósito |
|---|---|
| `backend/src/download_models.py` | Descarga los 4 `.pth` desde `HF_REPO` al arranque (HTTP con `requests`). Si `HF_REPO` no está, solo advierte (dev local). Expone `asegurar_modelos()`, `MODELOS`, `_ruta_destino()`. |
| `backend/requirements.txt` | Requirements de **producción** en ubicación estándar. Sin `gdown`; con `requests` añadido. |
| `backend/requirements-dev.txt` | `gdown==6.0.0` (solo lo usa el script legado). |
| `backend/Dockerfile` | Imagen del backend. `python:3.11-slim`, `libgomp1`, torch/torchvision **CPU-only**, arranque vía `startup.sh`. Contexto de build = **raíz del repo**. |
| `backend/startup.sh` | `python -m src.download_models` y luego `uvicorn ... --port ${PORT:-8080}`. |
| `frontend/Dockerfile` | Multi-stage: `node:20-alpine` (build con `ARG VITE_API_URL`) → `nginx:alpine`. |
| `frontend/nginx.conf` | Plantilla nginx SPA (`try_files … /index.html`), `listen ${PORT}` vía envsubst. |
| `frontend/.env.development` | `VITE_API_URL=http://localhost:8080`. |
| `frontend/.env.production` | `VITE_API_URL=https://REEMPLAZAR-...up.railway.app` (placeholder). |
| `frontend/.dockerignore` | Excluye `node_modules`, `dist`, `.git`. |
| `.dockerignore` (raíz) | Excluye `venv`, `*.pth`, `node_modules`, `.git`, etc. del contexto del backend. |
| `railway.toml` (raíz) | Config del **servicio backend** (builder dockerfile, `dockerfilePath=backend/Dockerfile`, healthcheck `/health`). |
| `frontend/railway.toml` | Config del **servicio frontend** (healthcheck `/`). |
| `backend/model/{yuca,platano,cacao}/.gitkeep` | Mantienen las carpetas en git tras destrackear los `.pth`. |

---

## Archivos modificados

| Archivo | Línea(s) | Qué cambió | Por qué |
|---|---|---|---|
| `backend/src/main.py` | 1-12 | Nuevos imports (`os`, `asynccontextmanager`, helpers de `download_models`) | Soporte de PORT/CORS/descarga |
| `backend/src/main.py` | 14-32 | `lifespan` que llama `asegurar_modelos()` al arrancar; `app` usa `lifespan=` | Descargar modelos de HF antes de servir (los predictores cargan los `.pth` de forma perezosa) |
| `backend/src/main.py` | 34-44 | CORS leído de `os.getenv("CORS_ORIGINS", "...")` y split por comas | CORS configurable por entorno (antes hardcodeado a localhost) |
| `backend/src/main.py` | 57-71 | Nuevo endpoint `GET /health` (200 si los 4 `.pth` están en disco, 503 si falta alguno) | Healthcheck para Railway |
| `backend/src/main.py` | 87-93 | Bloque `if __name__ == "__main__"` que lee `PORT` (fallback 8080) | Arranque local con puerto dinámico |
| `frontend/src/components/DiseaseDetector.jsx` | ~6 | Nueva const `API_URL = import.meta.env.VITE_API_URL || ''` | URL de backend configurable |
| `frontend/src/components/DiseaseDetector.jsx` | ~197 | `axios.post(\`${API_URL}/analizar\`, …)` (antes `'/analizar'`) | Usa la base URL en producción |
| `frontend/package.json` | 6-8 | Añadido `"engines": { "node": ">=18" }` | Fijar versión de Node |
| `README.md` | sección "Ejecutar" | Puerto `8000` → `8080`; `pip install -r requirements.txt`; instrucciones de `download_models` | Unificar puerto (8000 vs 8080) y reflejar nueva estructura |
| `.gitignore` | 1-13 | `backend/model/**/*.pth` (+ patrones existentes) | La regla `model/*.pth` no cubría subcarpetas |
| `.gitattributes` | 1 | Eliminada la línea LFS `*.pth …`; queda comentario | Ya no se usa LFS para modelos |
| `backend/model/download_model.py` | 1-9 | Comentario `[LEGADO — NO SE USA EN RUNTIME]` | Marcar como legado |

> El endpoint del frontend `/analizar` es el único que llama a la API (verificado con grep en todo `frontend/src`); no hay otras llamadas a `/cultivos` u otros que requieran el patrón `API_URL`.

> Decisión documentada: `backend/src/requirements.txt` se **mantuvo sin tocar** (sigue listando `gdown`) por compatibilidad con el README/flujo antiguo; el archivo canónico de producción es ahora `backend/requirements.txt`.

---

## Archivos eliminados de git (NO del disco)

`git rm --cached` sobre los 4 modelos (siguen intactos en disco local, ahora ignorados por `.gitignore`):

- `backend/model/yuca/efficientnet_cassava.pth` (≈68 MB)
- `backend/model/yuca/vit_cassava.pth` (≈106 MB)
- `backend/model/platano/mobilenet_platano.pth` (≈9 MB)
- `backend/model/cacao/efficientnet_cacao.pth` (≈16 MB)

Verificado: `git ls-files | grep .pth` → vacío.

---

## Variables de entorno que debo configurar en Railway

| Variable | Servicio | Valor esperado | Ejemplo |
|---|---|---|---|
| `HF_REPO` | backend | Repo de modelos en Hugging Face | `DANCN/amazonia-crop-models` |
| `HF_TOKEN` | backend | (Solo si el repo de HF es **privado**) token de lectura | `hf_xxxxxxxx` |
| `CORS_ORIGINS` | backend | URL pública del frontend (coma-separado si varias) | `https://amazonia-frontend.up.railway.app` |
| `PORT` | backend | **Inyectada por Railway automáticamente** — no la definas tú | `8080` |
| `VITE_API_URL` | frontend | URL pública del backend. Es **build arg** (se incrusta en el bundle) | `https://amazonia-backend.up.railway.app` |
| `PORT` | frontend | Inyectada por Railway; el template nginx la usa | `8080` |

> `VITE_API_URL` debe estar disponible **en build** del frontend (Railway: Build Args o variable normal — Nixpacks/Docker la pasan como ARG). Si la cambias, hay que **rebuildear** el frontend.

---

## Pasos manuales pendientes (para Daniel)

- [ ] **Subir los 4 `.pth` a Hugging Face** `DANCN/amazonia-crop-models` con estos nombres EXACTOS en la raíz del repo HF (sin subcarpetas): `efficientnet_cassava.pth`, `vit_cassava.pth`, `mobilenet_platano.pth`, `efficientnet_cacao.pth`. (`download_models.py` los baja de `…/resolve/main/<archivo>` y los coloca en la subcarpeta de cultivo correcta.)
- [ ] **Servicio BACKEND en Railway:** New Service → repo → **Root Directory = raíz del repo** (no `backend/`, porque el Dockerfile copia también `assets/`). Railway detectará `railway.toml` (raíz) → `backend/Dockerfile`.
- [ ] **Servicio FRONTEND en Railway:** New Service → mismo repo → **Root Directory = `frontend`**. Detectará `frontend/railway.toml` → `frontend/Dockerfile`. Define el build arg `VITE_API_URL` con la URL del backend.
- [ ] **Variables de entorno** de la tabla anterior en cada servicio.
- [ ] **Orden:** desplegar backend primero, copiar su URL pública → ponerla en `VITE_API_URL` (frontend) y en `CORS_ORIGINS` (backend), luego desplegar/rebuildear frontend.
- [ ] Probar `GET /health` del backend → debe responder `200` con los 4 modelos en `true`.
- [ ] (Si el repo HF es privado) generar `HF_TOKEN` de lectura y añadirlo al backend.

---

## Verificación local antes de pushear

```bash
# ── BACKEND ────────────────────────────────────────────────────────────
cd backend
# (usa tu venv existente; ya tiene torch/timm)
venv\Scripts\activate                 # Windows
pip install requests                  # nueva dependencia directa

# 1) download_models SIN HF_REPO → debe advertir y NO fallar
python -m src.download_models
#    Esperado: "ADVERTENCIA: HF_REPO no está definida…" o, si los .pth ya
#    están en disco, "Todos los modelos ya están en disco."

# 2) Levantar la API con el puerto unificado
uvicorn src.main:app --reload --port 8080

# 3) En otra terminal, probar endpoints
curl http://localhost:8080/health      # -> 200 y {"estado":"ok", ...} si los .pth están
curl http://localhost:8080/cultivos    # -> lista de cultivos
#    Probar una predicción real:
curl -F "cultivo=yuca" -F "imagen=@assets/sample_images/<una_imagen>.jpg" \
     http://localhost:8080/analizar

# 4) Probar CORS por entorno (opcional)
#    set CORS_ORIGINS=http://localhost:5173   (Windows: $env:CORS_ORIGINS=...)
#    y reiniciar uvicorn; la cabecera Access-Control-Allow-Origin debe reflejarlo.

# ── FRONTEND ───────────────────────────────────────────────────────────
cd ../frontend
npm install
npm run dev        # usa .env.development (VITE_API_URL=http://localhost:8080)
# Abrir http://localhost:5173 y hacer un análisis end-to-end.

# ── DOCKER (opcional, valida el build de despliegue) ──────────────────
# Backend (contexto = raíz del repo):
docker build -f backend/Dockerfile -t amazonia-backend .
docker run -p 8080:8080 -e PORT=8080 -e HF_REPO=DANCN/amazonia-crop-models amazonia-backend
# Frontend (contexto = frontend/):
docker build -f frontend/Dockerfile --build-arg VITE_API_URL=http://localhost:8080 \
     -t amazonia-frontend ./frontend
docker run -p 8081:80 -e PORT=80 amazonia-frontend
```

---
*Cambios aplicados sin commit/push. Revisa el diff y este reporte antes de versionar.*
