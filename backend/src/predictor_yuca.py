"""
predictor_yuca.py
Ensemble EfficientNet-B4 (w=0.45) + Swin Transformer (w=0.55)
Precisión: 89.04% | TTA: 7 variaciones
Dataset: Kaggle Cassava Leaf Disease Classification
"""
import torch
import timm
import numpy as np
import json
import io
import os
from PIL import Image
from torchvision import transforms

BASE         = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
EFFNET_PATH  = os.path.join(BASE, "backend", "model", "yuca", "efficientnet_cassava.pth")
VIT_PATH     = os.path.join(BASE, "backend", "model", "yuca", "vit_cassava.pth")
ENSEMBLE_CFG = os.path.join(BASE, "backend", "model", "yuca", "ensemble_info.json")
IDX_PATH     = os.path.join(BASE, "backend", "model", "yuca", "class_indices.json")
DICT_PATH    = os.path.join(BASE, "assets", "disease_info", "diseases_yuca_es.json")

with open(ENSEMBLE_CFG, encoding="utf-8") as f:
    cfg = json.load(f)
W_EFF  = cfg["w_efficientnet"]   # 0.45
W_SWIN = cfg["w_swin"]           # 0.55

with open(IDX_PATH,  encoding="utf-8") as f: IDX2INFO = json.load(f)
with open(DICT_PATH, encoding="utf-8") as f: DISEASES = json.load(f)

IMG_SIZE_EFF  = 380
IMG_SIZE_SWIN = 224


def _make_tta(size):
    norm = transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
    return [
        transforms.Compose([transforms.Resize((size, size)), transforms.ToTensor(), norm]),
        transforms.Compose([transforms.Resize((size, size)), transforms.RandomHorizontalFlip(1.0), transforms.ToTensor(), norm]),
        transforms.Compose([transforms.Resize((size, size)), transforms.RandomVerticalFlip(1.0), transforms.ToTensor(), norm]),
        transforms.Compose([transforms.Resize((size, size)), transforms.RandomRotation((90, 90)), transforms.ToTensor(), norm]),
        transforms.Compose([transforms.Resize((size, size)), transforms.RandomRotation((180, 180)), transforms.ToTensor(), norm]),
        transforms.Compose([transforms.Resize((size, size)), transforms.RandomRotation((270, 270)), transforms.ToTensor(), norm]),
        transforms.Compose([transforms.Resize((int(size * 1.15), int(size * 1.15))), transforms.CenterCrop(size), transforms.ToTensor(), norm]),
    ]


TTA_EFF  = _make_tta(IMG_SIZE_EFF)
TTA_SWIN = _make_tta(IMG_SIZE_SWIN)

_effnet = None
_swin   = None


def _cargar_modelos():
    global _effnet, _swin
    if _effnet is None:
        _effnet = timm.create_model("efficientnet_b4", pretrained=False, num_classes=5)
        _effnet.load_state_dict(torch.load(EFFNET_PATH, map_location="cpu", weights_only=True))
        _effnet.eval()
    if _swin is None:
        _swin = timm.create_model("swin_tiny_patch4_window7_224", pretrained=False,
                                  num_classes=5, img_size=224)
        _swin.load_state_dict(torch.load(VIT_PATH, map_location="cpu", weights_only=True))
        _swin.eval()
    return _effnet, _swin


def predecir(imagen_bytes: bytes) -> dict:
    effnet, swin = _cargar_modelos()
    img = Image.open(io.BytesIO(imagen_bytes)).convert("RGB")

    probs_eff  = np.zeros(5)
    probs_swin = np.zeros(5)

    with torch.no_grad():
        for t in TTA_EFF:
            logits = effnet(t(img).unsqueeze(0))
            probs_eff += torch.softmax(logits, dim=1)[0].numpy()
        for t in TTA_SWIN:
            logits = swin(t(img).unsqueeze(0))
            probs_swin += torch.softmax(logits, dim=1)[0].numpy()

    probs_eff  /= len(TTA_EFF)
    probs_swin /= len(TTA_SWIN)
    probs_final = W_EFF * probs_eff + W_SWIN * probs_swin

    idx       = int(np.argmax(probs_final))
    confianza = float(probs_final[idx])
    info_idx  = IDX2INFO[str(idx)]
    codigo    = info_idx["codigo"]
    info_dict = DISEASES[codigo]

    return {
        "cultivo":       "yuca",
        "clase_tecnica": info_idx["nombre_tecnico"],
        "codigo":        codigo,
        "confianza":     round(confianza * 100, 1),
        "nombre_es":     info_dict["nombre_es"],
        "agente":        info_dict["agente"],
        "tipo":          info_dict["tipo"],
        "estado":        info_dict["estado"],
        "urgencia":      info_dict["urgencia"],
        "descripcion":   info_dict["descripcion"],
        "sintomas":      info_dict["sintomas"],
        "tratamiento":   info_dict["tratamiento"],
        "prevencion":    info_dict["prevencion"],
        "impacto":       info_dict["impacto_economico"],
        "ensemble":      f"EfficientNet-B4({W_EFF}) + Swin({W_SWIN})",
        "tta":           len(TTA_EFF),
    }
