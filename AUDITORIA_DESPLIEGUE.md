# Auditoría Pre-Despliegue — AmazoniaCrop
Fecha: 2026-06-18
Alcance: diagnóstico previo a despliegue en Railway. **No se modificó ningún archivo de código.**

## Resumen ejecutivo
El proyecto **no está listo para desplegar** tal cual; hay 4 bloqueadores claros, ninguno grave de lógica (los modelos, arquitecturas y nombres de archivo coinciden perfectamente entre código y disco). Los bloqueadores son de *empaquetado/configuración*: (1) el backend **no lee el puerto de `$PORT`** ni hay Dockerfile/Procfile/`railway.toml`; (2) **CORS hardcodeado** a `localhost`; (3) el **frontend llama a `/analizar` con URL relativa** dependiendo del proxy de Vite (solo existe en `dev`), sin `VITE_API_URL`; (4) **inconsistencia de Git LFS**: los modelos de cacao y plátano están commiteados como *blobs reales* en lugar de punteros LFS (por eso aparecen como modificados). El plan de subir los modelos a Hugging Face es buena idea — los nombres exactos que espera cada router están documentados en la sección 4 (todos coinciden, no hay que renombrar nada).

---

## 1. Inventario de modelos (.pth)

| Archivo | Ruta | Tamaño | Cargado en | Estado |
|---|---|---|---|---|
| `efficientnet_cassava.pth` | `backend/model/yuca/` | 68 MB | `predictor_yuca.py:17,59` (`torch.load`) | ✅ Existe · puntero LFS OK |
| `vit_cassava.pth` | `backend/model/yuca/` | 106 MB | `predictor_yuca.py:18,64` (`torch.load`) | ✅ Existe · puntero LFS OK |
| `mobilenet_platano.pth` | `backend/model/platano/` | 9 MB | `predictor_platano.py:18,48` | ⚠️ Existe pero **blob normal en git, no LFS** |
| `efficientnet_cacao.pth` | `backend/model/cacao/` | 16 MB | `predictor_cacao.py:18,48` | ⚠️ Existe pero **blob normal en git, no LFS** |
| `distutils-precedence.pth` | `backend/venv/Lib/site-packages/` | <1 MB | — (artefacto de setuptools, no es un modelo) | ➖ Ignorar; `venv/` no debe subirse |

No se encontraron `.pt` ni `.bin` de modelos. **No falta ningún modelo que el código espere** — los 4 archivos que cargan los predictores existen en disco con el nombre exacto.

> Nota: `backend/model/download_model.py` referencia un quinto path histórico `backend/model/efficientnet_cassava.pth` (raíz de `model/`, sin subcarpeta `yuca/`). Ese script es legado del proyecto original solo-yuca y **no lo usa el backend en runtime** (ningún `main/router/predictor` lo importa). No es bloqueador, pero conviene marcarlo como obsoleto.

---

## 2. Routers y predictors

Arquitectura real: **un único endpoint** `POST /analizar` que recibe `cultivo` (Form) + `imagen` (File) y enruta vía `src/router.py` → predictor por cultivo. **No** hay endpoints por cultivo tipo `/api/cassava/predict`.

| Cultivo | Predictor | Modelo(s) (archivo) | Arquitectura (timm) | img_size | Clases (orden) | TTA | Ensemble |
|---|---|---|---|---|---|---|---|
| Yuca | `predictor_yuca.py` | `efficientnet_cassava.pth` + `vit_cassava.pth` | `efficientnet_b4` + `swin_tiny_patch4_window7_224` | 380 (eff) / 224 (swin) | CBB, CBSD, CGM, CMD, Healthy | ×7 | Sí — eff 0.45 / swin 0.55 |
| Plátano | `predictor_platano.py` | `mobilenet_platano.pth` | `mobilenetv2_100` | 224 | cordana, healthy, pestalotiopsis, sigatoka | ×5 | No |
| Cacao | `predictor_cacao.py` | `efficientnet_cacao.pth` | `efficientnet_b0` | 224 | healthy, black_pod_rot | ×5 | No |

**Endpoints expuestos** (`backend/src/main.py`): `GET /`, `GET /cultivos`, `POST /analizar`.

> Observación: `router.py:20` describe el modelo de yuca como "EfficientNet-B4 + **Swin** Transformer" (correcto), pero la cadena devuelta usa `swin_tiny`. El docstring de `predictor_yuca.py:1` lo llama "ViT" y las variables/archivo se llaman `VIT_PATH`/`vit_cassava.pth` aunque la arquitectura real es **Swin**, no ViT. Es solo nomenclatura confusa, no un bug — el archivo se carga correctamente como Swin.

---

## 3. Archivos JSON de configuración

| Archivo | Ruta | Propósito | Leído correctamente |
|---|---|---|---|
| `ensemble_info.json` | `backend/model/yuca/` | Pesos del ensemble (`w_efficientnet`:0.45, `w_swin`:0.55) | ✅ `predictor_yuca.py:23-26` |
| `class_indices.json` | `backend/model/yuca/` | Mapeo idx→código/nombre técnico (5 clases) | ✅ `predictor_yuca.py:20,28` |
| `class_indices.json` | `backend/model/platano/` | Mapeo idx→código (4 clases) | ✅ `predictor_platano.py:19,22` |
| `class_indices.json` | `backend/model/cacao/` | Mapeo idx→código (2 clases) | ✅ `predictor_cacao.py:19,22` |
| `diseases_yuca_es.json` | `assets/disease_info/` | Ficha de enfermedad ES (síntomas, tratamiento…) | ✅ `predictor_yuca.py:21,29` |
| `diseases_platano_es.json` | `assets/disease_info/` | Ficha ES plátano | ✅ `predictor_platano.py:20,23` |
| `diseases_cacao_es.json` | `assets/disease_info/` | Ficha ES cacao | ✅ `predictor_cacao.py:20,23` |

Todos los JSON existen y se leen sin problema. `model_info.txt` es informativo (legado yuca), no se consume.

---

## 4. ⚠️ Discrepancias de nombres (CRÍTICO)

**No hay discrepancias.** Lo que el código busca == lo que existe en disco:

| Código espera | Existe en disco | ¿Coincide? |
|---|---|---|
| `backend/model/yuca/efficientnet_cassava.pth` | ✅ mismo | ✅ |
| `backend/model/yuca/vit_cassava.pth` | ✅ mismo | ✅ |
| `backend/model/platano/mobilenet_platano.pth` | ✅ mismo | ✅ |
| `backend/model/cacao/efficientnet_cacao.pth` | ✅ mismo | ✅ |

**Para la migración a Hugging Face Hub**, estos son los nombres EXACTOS que cada router descarga/abre (no cambiarlos): `efficientnet_cassava.pth`, `vit_cassava.pth`, `mobilenet_platano.pth`, `efficientnet_cacao.pth`. Las rutas se construyen con `os.path.join(BASE, "backend", "model", <cultivo>, <archivo>)` en cada `predictor_*.py:16-20`, así que el descargador de HF debe depositar cada archivo en su subcarpeta correspondiente con ese nombre.

---

## 5. Rutas hardcodeadas y variables de entorno

| Hallazgo | Ubicación | Recomendación |
|---|---|---|
| **No se usa `os.getenv` en ningún sitio** | todo `backend/src/` | Nada configurable por entorno hoy. Hay que introducir env vars antes de Railway. |
| **Puerto no lee `$PORT`** | `main.py` (no hay bloque de arranque) | Railway inyecta `$PORT`. Arrancar con `uvicorn src.main:app --host 0.0.0.0 --port $PORT`. |
| **Inconsistencia de puerto en docs** | README dice `8000`; `vite.config.js:11` y mensaje de error `DiseaseDetector.jsx:202` dicen `8080` | Unificar a un solo puerto local. |
| **CORS hardcodeado** | `main.py:18` → `allow_origins=["http://localhost:5173","http://localhost:3000"]` | Bloqueará el frontend en producción. Leer de `os.getenv("CORS_ORIGINS")`. |
| **No hay rutas absolutas tipo `D:\` o `/home/`** | — | ✅ Bien. Todas las rutas son relativas vía `BASE = os.path.abspath(__file__/../..)`. Funcionan en contenedor. |
| **`BASE` asume layout `backend/model/...`** | `predictor_*.py:16-18` | Si en Docker el WORKDIR cambia, mantener el árbol `backend/model/<cultivo>/`. Compatible si se copia el repo completo. |
| **No hay Dockerfile / Procfile / `railway.toml` / `nixpacks.toml`** | raíz del proyecto | Crear configuración de despliegue (start command + dónde está `requirements.txt`). |

---

## 6. Dependencias

`requirements.txt` está en **`backend/src/requirements.txt`** (no en `backend/requirements.txt` ni en la raíz) — Railway/Nixpacks no lo encontrará automáticamente.

Contenido:
```
torch==2.11.0  torchvision==0.22.0  timm==1.0.15  numpy==2.2.5
Pillow==11.2.1  fastapi==0.115.12  uvicorn==0.34.2
python-multipart==0.0.20  gdown==6.0.0
```

| Tipo | Detalle |
|---|---|
| ✅ Usadas y presentes | `torch`, `torchvision`, `timm`, `numpy`, `Pillow`(PIL), `fastapi`, `uvicorn`, `python-multipart` (necesaria para `Form`/`UploadFile`) |
| ⚠️ Sobrante en runtime | `gdown==6.0.0` — solo lo usa `model/download_model.py` (script legado), no la API. Puede quedarse (inofensivo) o moverse a un requirements de dev. |
| ⚠️ Faltante (si se añaden env vars) | `python-dotenv` no está; se necesitará si se leen `.env`. (`os.getenv` no lo requiere si las vars vienen del entorno Railway.) |
| ✅ TensorFlow | **Cero referencias** a `tensorflow`/`keras`/`.h5`/`tf.` en código Python. Migración a PyTorch completa, sin residuos. |

> Atención al tamaño: `torch==2.11.0` + `torchvision` hacen la imagen muy pesada. Considerar `torch` CPU-only (índice `download.pytorch.org/whl/cpu`) para reducir la imagen en Railway.

---

## 7. Frontend — configuración de API

- **Llamada al backend:** `frontend/src/components/DiseaseDetector.jsx:192` → `axios.post('/analizar', fd, …)` con **URL relativa**. No hay `baseURL`, ni `VITE_API_URL`, ni `import.meta.env`.
- **Cómo funciona hoy:** depende del **proxy de Vite** (`vite.config.js:6-15`) que redirige `/analizar` y `/cultivos` a `http://localhost:8080`. **Ese proxy solo existe en `npm run dev`** — en el build de producción (`vite build`, estático) no hay proxy, así que `/analizar` apuntará al mismo origen donde se sirva el frontend.
- **Implicación para Railway:** si frontend y backend se despliegan por separado, las llamadas relativas fallarán. Hay que introducir `const API = import.meta.env.VITE_API_URL` y usarlo como base, o servir el frontend desde el mismo origen que la API.
- **No existen archivos `.env`** en `frontend/`.
- **package.json:** sin campo `engines` (versión de Node no fijada). Scripts: `dev`, `build` (`vite build`), `lint`, `preview`. Stack: React 19, Vite 8, axios 1.15, framer-motion 12, lucide-react 1.8.

---

## 8. Estructura del proyecto

```
cassava-disease-detector/
├── .gitattributes        (*.pth → LFS)
├── .gitignore
├── README.md
├── AUDITORIA_DESPLIEGUE.md
├── assets/               (24 KB)
│   ├── disease_info/      → diseases_{yuca,platano,cacao}_es.json + graficos/
│   └── sample_images/
├── backend/              (198 MB — incluye los 4 modelos ≈199 MB; venv excluido)
│   ├── model/
│   │   ├── download_model.py   (legado)
│   │   ├── model_info.txt
│   │   ├── yuca/      → efficientnet_cassava.pth, vit_cassava.pth, ensemble_info.json, class_indices.json
│   │   ├── platano/   → mobilenet_platano.pth, class_indices.json
│   │   └── cacao/     → efficientnet_cacao.pth, class_indices.json
│   ├── src/
│   │   ├── main.py          (FastAPI app, endpoints)
│   │   ├── router.py        (enrutado por cultivo + CULTIVOS_INFO)
│   │   ├── predictor_yuca.py / predictor_platano.py / predictor_cacao.py
│   │   └── requirements.txt
│   └── venv/            (NO debe subirse — ya en .gitignore)
└── frontend/             (13 MB sin node_modules/dist)
    ├── package.json / vite.config.js
    ├── public/          → cacao.png, platano.png, yuca.png, amazonia_bg.jpg, cultivos/
    └── src/
        ├── App.jsx / main.jsx / *.css
        └── components/  → DiseaseDetector, CropSelector, Hero, InfoSection, Footer, DatasetSection, CassavaCultivo
```
Tamaños: **backend 198 MB** (dominado por los modelos), **frontend 13 MB**, **assets 24 KB**.

---

## 9. Estado de git

- **¿`.pth` trackeados?** Sí, los 4 (`git ls-files`). Configurados para LFS vía `.gitattributes` (`*.pth filter=lfs`).
- **⚠️ Inconsistencia LFS (causa de los "modificados" en `git status`):**
  - `yuca/efficientnet_cassava.pth` y `yuca/vit_cassava.pth` → **punteros LFS correctos** (blob de 133 bytes en HEAD). ✅
  - `cacao/efficientnet_cacao.pth` (16.3 MB) y `platano/mobilenet_platano.pth` (9.2 MB) → **commiteados como blobs reales, NO como punteros LFS**. Como `.gitattributes` ahora exige LFS, Git intenta re-normalizarlos y por eso aparecen como `M` (modified) en el estado inicial.
  - **Acción:** re-migrarlos a LFS (`git lfs migrate import --include="*.pth"` o re-`git add` con el filtro LFS activo) **o** decidir servir los modelos desde Hugging Face y sacarlos del repo. Mezclar ambos esquemas romperá el clon/checkout en Railway.
- **`.gitignore`:** cubre `venv/`, `__pycache__/`, `*.pyc`, `node_modules/`, `dist/`, `.env`, `kaggle.json`. ⚠️ La regla `backend/model/*.pth` **solo ignora la raíz de `model/`, no las subcarpetas** (`yuca/`, `platano/`, `cacao/`), por eso los modelos en subcarpetas sí se trackearon. Si la intención es ignorar todos los `.pth`, usar `backend/model/**/*.pth` o `*.pth`.

---

## 10. Checklist de acciones requeridas antes de Railway

- [ ] **Puerto dinámico:** añadir bloque de arranque que lea `$PORT`, o start command `uvicorn src.main:app --host 0.0.0.0 --port $PORT` (`backend/src/main.py`).
- [ ] **CORS por entorno:** reemplazar la lista hardcodeada de `main.py:18` por `os.getenv("CORS_ORIGINS", "...")` y configurar el dominio del frontend en Railway.
- [ ] **Frontend API URL:** introducir `VITE_API_URL` (`import.meta.env`) en `DiseaseDetector.jsx:192` (y `/cultivos` si se usa) en lugar de la ruta relativa que depende del proxy de Vite.
- [ ] **Config de despliegue:** crear `Dockerfile` o `railway.toml`/`nixpacks.toml` + Procfile, indicando dónde está `requirements.txt`.
- [ ] **Ubicación de requirements:** mover/copiar `backend/src/requirements.txt` a una ruta que el builder detecte (`backend/requirements.txt` o raíz), o apuntarlo explícitamente.
- [ ] **Resolver LFS:** re-migrar `cacao/efficientnet_cacao.pth` y `platano/mobilenet_platano.pth` a punteros LFS, **o** moverlos (junto a los de yuca) a Hugging Face Hub y descargarlos en arranque. No mezclar.
- [ ] **(Si HF) Descarga en arranque:** script que baje los 4 `.pth` a `backend/model/<cultivo>/` con los nombres exactos de la sección 4, antes del primer `predecir`.
- [ ] **Imagen ligera:** usar `torch` CPU-only (`--index-url .../whl/cpu`) para reducir el tamaño de imagen y el tiempo de build.
- [ ] **Unificar puerto local** en docs/proxy/mensaje de error (README dice 8000; Vite y el frontend dicen 8080).
- [ ] **(Opcional) Limpieza:** marcar `backend/model/download_model.py` y `model_info.txt` como legado; mover `gdown` a dependencias de dev.
- [ ] **(Opcional) Fijar Node:** añadir `"engines": { "node": ">=18" }` en `frontend/package.json`.
- [ ] **(Opcional) Corregir `.gitignore`:** `backend/model/**/*.pth` si se quiere ignorar todos los modelos.

---
*Auditoría generada sin modificar código. Las referencias `archivo:línea` apuntan al estado actual del repositorio.*
