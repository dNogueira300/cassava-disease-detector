"""
download_models.py — Descarga de modelos desde Hugging Face Hub
================================================================
Los 4 modelos .pth NO se versionan en git. Se alojan en un repo de
Hugging Face Hub y se descargan al arrancar el contenedor si no están
ya presentes en disco.

Variables de entorno:
    HF_REPO    Repo de Hugging Face (ej: "DANCN/amazonia-crop-models").
               Si NO está definida, no se descarga nada: se asume que los
               modelos ya están en disco (modo desarrollo local).
    HF_TOKEN   (opcional) Token de acceso si el repo de HF es privado.

Uso:
    from src.download_models import asegurar_modelos
    asegurar_modelos()
"""
import os
import sys

# Raíz del proyecto: este archivo vive en backend/src/, subimos dos niveles.
BASE = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))

# Mapeo exacto archivo .pth -> subcarpeta de cultivo (nombres confirmados en
# AUDITORIA_DESPLIEGUE.md, sección 4). NO cambiar estos nombres: cada
# predictor_*.py los abre por ruta hardcodeada.
MODELOS = [
    ("efficientnet_cassava.pth", "yuca"),
    ("vit_cassava.pth",          "yuca"),
    ("mobilenet_platano.pth",    "platano"),
    ("efficientnet_cacao.pth",   "cacao"),
]


def _ruta_destino(archivo: str, cultivo: str) -> str:
    return os.path.join(BASE, "backend", "model", cultivo, archivo)


def _descargar(url: str, destino: str, headers: dict) -> None:
    """Descarga por streaming con requests, mostrando progreso simple."""
    import requests

    os.makedirs(os.path.dirname(destino), exist_ok=True)
    with requests.get(url, headers=headers, stream=True, timeout=60) as r:
        r.raise_for_status()
        total = int(r.headers.get("content-length", 0))
        descargado = 0
        tmp = destino + ".part"
        with open(tmp, "wb") as f:
            for chunk in r.iter_content(chunk_size=1024 * 1024):
                if not chunk:
                    continue
                f.write(chunk)
                descargado += len(chunk)
                if total:
                    pct = descargado * 100 // total
                    print(f"\r    {pct:3d}%  ({descargado/1e6:.1f}/{total/1e6:.1f} MB)",
                          end="", flush=True)
        print()
        os.replace(tmp, destino)


def asegurar_modelos() -> None:
    """
    Garantiza que los 4 .pth existan en disco antes de cargar los modelos.
    Si HF_REPO no está definida, solo advierte y continúa (dev local).
    """
    hf_repo = os.getenv("HF_REPO", "").strip()
    hf_token = os.getenv("HF_TOKEN", "").strip()
    headers = {"Authorization": f"Bearer {hf_token}"} if hf_token else {}

    print("=" * 60)
    print("AmazoniaCrop — verificación de modelos")
    print("=" * 60)

    faltantes = [
        (a, c) for a, c in MODELOS if not os.path.exists(_ruta_destino(a, c))
    ]

    if not faltantes:
        print("Todos los modelos ya están en disco. Nada que descargar.")
        return

    if not hf_repo:
        print("ADVERTENCIA: HF_REPO no está definida y faltan modelos:")
        for archivo, cultivo in faltantes:
            print(f"  - backend/model/{cultivo}/{archivo}")
        print("  Se asume entorno de desarrollo local; el backend fallará al "
              "predecir si estos archivos no se colocan manualmente.")
        return

    print(f"HF_REPO = {hf_repo}")
    for archivo, cultivo in MODELOS:
        destino = _ruta_destino(archivo, cultivo)
        if os.path.exists(destino):
            size = os.path.getsize(destino) / 1e6
            print(f"[OK]   {cultivo}/{archivo} ya existe ({size:.1f} MB)")
            continue
        url = f"https://huggingface.co/{hf_repo}/resolve/main/{archivo}"
        print(f"[GET]  {cultivo}/{archivo}  <-  {url}")
        try:
            _descargar(url, destino, headers)
            size = os.path.getsize(destino) / 1e6
            print(f"       descargado ({size:.1f} MB)")
        except Exception as e:  # noqa: BLE001
            print(f"ERROR descargando {archivo}: {e}", file=sys.stderr)
            raise


if __name__ == "__main__":
    asegurar_modelos()
