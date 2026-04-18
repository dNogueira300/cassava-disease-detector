# YucaIA — Cassava Disease Detector
## Detección de Enfermedades en Yuca (*Manihot esculenta*) · Amazonía Peruana

Sistema de inteligencia artificial para detectar enfermedades en hojas de yuca
mediante fotografías. Diseñado para agricultores de la Amazonía peruana.

## Dataset
- **Kaggle Cassava Leaf Disease Classification**
- 21,367 imágenes etiquetadas por expertos del NaCRRI + AI Lab Makerere University
- 5 clases: CMD · CBB · CBSD · CGM · Healthy
- URL: https://www.kaggle.com/c/cassava-leaf-disease-classification

## Modelo
- **EfficientNet-B4** con Transfer Learning (ImageNet → Cassava)
- Precisión: ~91% en test set de Kaggle
- Inferencia en CPU: ~100–300ms por imagen

## Stack
- **IA:** PyTorch + timm (EfficientNet-B4)
- **Backend:** FastAPI
- **Frontend:** React + Vite + Lucide React + Framer Motion

## Ejecutar

```bash
# Backend
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r src/requirements.txt
python model/download_model.py
uvicorn src.main:app --reload --port 8000

# Frontend (otra terminal)
cd frontend
npm install
npm run dev
```

Abrir: http://localhost:5173

## Proyectos de referencia
- [Top 1% Kaggle — CNN + ViT Ensemble (kozodoi)](https://github.com/kozodoi/Kaggle_Leaf_Disease_Classification)
- [EfficientNetB4 Transfer Learning (Lwhieldon)](https://github.com/Lwhieldon/Cassava-Leaf-Disease-Classification)
- [ResNet-152 + TTA (owenpb)](https://github.com/owenpb/Kaggle-Cassava-Leaf-Classification)

---
*Modelo: EfficientNet-B4 · Dataset: Kaggle Cassava Leaf Disease Classification*
