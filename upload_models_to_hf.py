"""
upload_models_to_hf.py
──────────────────────
Sube los 4 modelos .pth a Hugging Face Hub para que Railway los descargue
al arrancar el contenedor (vía backend/src/download_models.py).

Uso:
    pip install huggingface-hub
    set HF_TOKEN=hf_xxxxxxxxxxxxxxxxxxxx      (PowerShell: $env:HF_TOKEN="hf_...")
    python upload_models_to_hf.py
"""

import os
from huggingface_hub import HfApi, login

# ── Configuración ─────────────────────────────────────────────────────────
HF_USERNAME = "DANCN"
HF_REPO_NAME = "amazonia-crop-models"
HF_TOKEN = os.getenv("HF_TOKEN")

# Rutas reales confirmadas en AUDITORIA_DESPLIEGUE.md (sección 1 y 4).
# Los modelos siguen en disco local aunque ya se destrackearon de git.
BASE_DIR = r"D:\300\OTROS\XXX\DAN\IA\cassava-disease-detector\backend\model"

# Mapa: ruta local -> nombre EXACTO con el que se sube a HF (raíz del repo,
# sin subcarpetas — así lo espera download_models.py)
FILES = {
    rf"{BASE_DIR}\yuca\efficientnet_cassava.pth":   "efficientnet_cassava.pth",
    rf"{BASE_DIR}\yuca\vit_cassava.pth":            "vit_cassava.pth",
    rf"{BASE_DIR}\platano\mobilenet_platano.pth":   "mobilenet_platano.pth",
    rf"{BASE_DIR}\cacao\efficientnet_cacao.pth":    "efficientnet_cacao.pth",
}

# ─────────────────────────────────────────────────────────────────────────────


def main():
    if not HF_TOKEN:
        raise EnvironmentError(
            "Define HF_TOKEN como variable de entorno antes de ejecutar:\n"
            "  PowerShell: $env:HF_TOKEN=\"hf_...\"\n"
            "  CMD:        set HF_TOKEN=hf_...\n"
            "Genera el token en https://huggingface.co/settings/tokens (tipo Write)."
        )

    print(f"🔑 Autenticando en Hugging Face como {HF_USERNAME}...")
    login(token=HF_TOKEN)

    api = HfApi()
    repo_id = f"{HF_USERNAME}/{HF_REPO_NAME}"

    # Crear repo PRIVADO si no existe (ya debería existir según conversación previa)
    try:
        api.create_repo(repo_id=repo_id, repo_type="model", private=True, exist_ok=True)
        print(f"📦 Repositorio: https://huggingface.co/{repo_id}")
    except Exception as e:
        print(f"⚠️  {e}")

    faltantes = []
    for fpath, fname in FILES.items():
        if not os.path.exists(fpath):
            faltantes.append(fpath)
            print(f"⏭️  No encontrado: {fpath} — omitiendo")
            continue

        size_mb = os.path.getsize(fpath) / 1_048_576
        print(f"⬆️  Subiendo {fname} ({size_mb:.1f} MB) desde {fpath} ...")

        api.upload_file(
            path_or_fileobj=fpath,
            path_in_repo=fname,          # va a la RAÍZ del repo HF, sin subcarpeta
            repo_id=repo_id,
            repo_type="model",
        )
        print(f"✅  {fname} subido")

    if faltantes:
        print(f"\n⚠️  {len(faltantes)} archivo(s) no se encontraron y no se subieron.")
    else:
        print("\n🎉 ¡Los 4 modelos subidos correctamente!")
        print(f"   URL: https://huggingface.co/{repo_id}")
        print(f"\n   Variables para Railway (servicio backend):")
        print(f"   HF_REPO  = {repo_id}")
        print(f"   HF_TOKEN = <genera un token de lectura (Read), distinto al Write usado aquí>")


if __name__ == "__main__":
    main()