"""
router.py
Enruta la solicitud al predictor correcto según el cultivo seleccionado.
Cultivos soportados: yuca · platano · cacao
"""
from src.predictor_yuca    import predecir as _yuca
from src.predictor_platano import predecir as _platano
from src.predictor_cacao   import predecir as _cacao

PREDICTORES = {
    "yuca":    _yuca,
    "platano": _platano,
    "cacao":   _cacao,
}

CULTIVOS_INFO = {
    "yuca": {
        "nombre":            "Yuca",
        "nombre_cientifico": "Manihot esculenta Crantz",
        "modelo":            "EfficientNet-B4 + Swin Transformer (Ensemble)",
        "precision":         "89.04%",
        "dataset":           "Kaggle Cassava Leaf Disease Classification",
        "n_imagenes":        21397,
        "n_clases":          5,
        "clases":            ["CBB", "CBSD", "CGM", "CMD", "Healthy"],
    },
    "platano": {
        "nombre":            "Plátano / Banano",
        "nombre_cientifico": "Musa paradisiaca L.",
        "modelo":            "MobileNetV2 + TTA×5",
        "precision":         "99.4%",
        "dataset":           "BananaLSD (Kaggle)",
        "n_imagenes":        2537,
        "n_clases":          4,
        "clases":            ["Cordana", "Healthy", "Pestalotiopsis", "Sigatoka"],
    },
    "cacao": {
        "nombre":            "Cacao",
        "nombre_cientifico": "Theobroma cacao L.",
        "modelo":            "EfficientNet-B0 + TTA×5",
        "precision":         "95.1%",
        "dataset":           "Cacao Diseases (Kaggle)",
        "n_imagenes":        4287,
        "n_clases":          2,
        "clases":            ["Healthy", "Black Pod Rot (Fitóftora)"],
    },
}


def predecir_por_cultivo(cultivo: str, imagen_bytes: bytes) -> dict:
    cultivo = cultivo.lower().strip()
    if cultivo not in PREDICTORES:
        raise ValueError(
            f"Cultivo '{cultivo}' no soportado. "
            f"Opciones: {list(PREDICTORES.keys())}"
        )
    return PREDICTORES[cultivo](imagen_bytes)
