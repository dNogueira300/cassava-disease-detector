"""
Inferencia EfficientNet-B4 para detección de enfermedades en yuca.
Framework: PyTorch + timm. No requiere GPU para inferencia.
Dataset: https://www.kaggle.com/c/cassava-leaf-disease-classification
"""

import torch
import timm
import numpy as np
from PIL import Image
import io, json, os
from torchvision import transforms

BASE       = os.path.join(os.path.dirname(__file__), "..", "..")
MODEL_PATH = os.path.join(BASE, "backend", "model", "efficientnet_cassava.pth")
IDX_PATH   = os.path.join(BASE, "backend", "model", "class_indices.json")
DICT_PATH  = os.path.join(BASE, "assets", "disease_info", "diseases_es.json")

IMG_SIZE = 380
TRANSFORM = transforms.Compose([
    transforms.Resize((IMG_SIZE, IMG_SIZE)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
])

with open(IDX_PATH, encoding="utf-8") as f:
    IDX2INFO = json.load(f)
with open(DICT_PATH, encoding="utf-8") as f:
    DISEASES = json.load(f)

_model = None

def _cargar_modelo():
    global _model
    if _model is not None:
        return _model
    modelo = timm.create_model("efficientnet_b4", pretrained=False, num_classes=5)
    state = torch.load(MODEL_PATH, map_location="cpu", weights_only=True)
    modelo.load_state_dict(state)
    modelo.eval()
    _model = modelo
    return _model

def predecir(imagen_bytes: bytes) -> dict:
    modelo = _cargar_modelo()
    img = Image.open(io.BytesIO(imagen_bytes)).convert("RGB")
    tensor = TRANSFORM(img).unsqueeze(0)
    with torch.no_grad():
        logits = modelo(tensor)
        probs  = torch.softmax(logits, dim=1)[0].numpy()
    idx       = int(np.argmax(probs))
    confianza = float(probs[idx])
    info_idx  = IDX2INFO[str(idx)]
    codigo    = info_idx["codigo"]
    info_dict = DISEASES[codigo]
    return {
        "clase_tecnica": info_idx["nombre_tecnico"],
        "codigo":        codigo,
        "confianza":     round(confianza * 100, 1),
        "nombre_es":     info_dict["nombre_es"],
        "cultivo":       info_dict["cultivo"],
        "agente":        info_dict["agente"],
        "tipo":          info_dict["tipo"],
        "estado":        info_dict["estado"],
        "urgencia":      info_dict["urgencia"],
        "descripcion":   info_dict["descripcion"],
        "sintomas":      info_dict["sintomas"],
        "tratamiento":   info_dict["tratamiento"],
        "prevencion":    info_dict["prevencion"],
        "impacto":       info_dict["impacto_economico"],
    }
