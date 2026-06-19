"""
predictor_cacao.py
EfficientNet-B0 con TTA x5
Precisión: 95.1% en validación
Dataset: Cacao Diseases (4,287 imágenes)
Clases: healthy · black_pod_rot
"""
import torch
import timm
import numpy as np
import json
import io
import os
from PIL import Image
from torchvision import transforms

BASE       = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
MODEL_PATH = os.path.join(BASE, "backend", "model", "cacao", "efficientnet_cacao.pth")
IDX_PATH   = os.path.join(BASE, "backend", "model", "cacao", "class_indices.json")
DICT_PATH  = os.path.join(BASE, "assets", "disease_info", "diseases_cacao_es.json")

with open(IDX_PATH,  encoding="utf-8") as f: IDX2INFO = json.load(f)
with open(DICT_PATH, encoding="utf-8") as f: DISEASES = json.load(f)

IMG_SIZE   = 224
NUM_CLASES = 2


def _make_tta(size):
    norm = transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
    return [
        transforms.Compose([transforms.Resize((size, size)), transforms.ToTensor(), norm]),
        transforms.Compose([transforms.Resize((size, size)), transforms.RandomHorizontalFlip(p=1.0), transforms.ToTensor(), norm]),
        transforms.Compose([transforms.Resize((size, size)), transforms.RandomVerticalFlip(p=1.0), transforms.ToTensor(), norm]),
        transforms.Compose([transforms.Resize((size, size)), transforms.RandomRotation((90, 90)), transforms.ToTensor(), norm]),
        transforms.Compose([transforms.Resize((int(size * 1.15), int(size * 1.15))), transforms.CenterCrop(size), transforms.ToTensor(), norm]),
    ]


TTA    = _make_tta(IMG_SIZE)
_model = None


def _cargar():
    global _model
    if _model is None:
        _model = timm.create_model("efficientnet_b0", pretrained=False, num_classes=NUM_CLASES)
        _model.load_state_dict(torch.load(MODEL_PATH, map_location="cpu", weights_only=True))
        _model.eval()
    return _model


def predecir(imagen_bytes: bytes) -> dict:
    modelo = _cargar()
    img    = Image.open(io.BytesIO(imagen_bytes)).convert("RGB")

    probs = np.zeros(NUM_CLASES)
    with torch.no_grad():
        for t in TTA:
            probs += torch.softmax(modelo(t(img).unsqueeze(0)), dim=1)[0].numpy()
    probs /= len(TTA)

    idx       = int(np.argmax(probs))
    confianza = float(probs[idx])
    info_idx  = IDX2INFO[str(idx)]
    codigo    = info_idx["codigo"]
    info      = DISEASES[codigo]

    return {
        "cultivo":       "cacao",
        "clase_tecnica": info_idx["nombre_tecnico"],
        "codigo":        codigo,
        "confianza":     round(confianza * 100, 1),
        "nombre_es":     info["nombre_es"],
        "agente":        info["agente"],
        "tipo":          info["tipo"],
        "estado":        info["estado"],
        "urgencia":      info["urgencia"],
        "descripcion":   info["descripcion"],
        "sintomas":      info["sintomas"],
        "tratamiento":   info["tratamiento"],
        "prevencion":    info["prevencion"],
        "impacto":       info["impacto_economico"],
        "modelo":        "EfficientNet-B0 + TTA×5",
    }
