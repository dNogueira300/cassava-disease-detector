"""
Genera class_indices.json y model_info.txt.

Para obtener los pesos del modelo EfficientNet-B4 entrenado en Cassava:
  Opcion 1: Kaggle Notebooks de la competencia
    https://www.kaggle.com/c/cassava-leaf-disease-classification/code
    Buscar: 'EfficientNet cassava weights' y descargar el .pth

  Opcion 2: Google Colab con GPU T4 gratuita (~45 min)
    https://github.com/kozodoi/Kaggle_Leaf_Disease_Classification

Guardar el archivo de pesos como:
  backend/model/efficientnet_cassava.pth
"""

import os, json

MODEL_DIR = os.path.join(os.path.dirname(__file__))

CLASS_INDICES = {
    "0": {"codigo": "CBB",     "nombre_tecnico": "Cassava Bacterial Blight",    "nombre_es": "Bacteriosis de la yuca",         "urgencia": "alta"},
    "1": {"codigo": "CBSD",    "nombre_tecnico": "Cassava Brown Streak Disease", "nombre_es": "Enfermedad de rayas pardas",     "urgencia": "critica"},
    "2": {"codigo": "CGM",     "nombre_tecnico": "Cassava Green Mottle",         "nombre_es": "Moteado verde de la yuca",       "urgencia": "media"},
    "3": {"codigo": "CMD",     "nombre_tecnico": "Cassava Mosaic Disease",       "nombre_es": "Mosaico de la yuca",             "urgencia": "alta"},
    "4": {"codigo": "HEALTHY", "nombre_tecnico": "Healthy",                      "nombre_es": "Planta sana",                    "urgencia": "ninguna"}
}

with open(os.path.join(MODEL_DIR, "class_indices.json"), "w", encoding="utf-8") as f:
    json.dump(CLASS_INDICES, f, indent=2, ensure_ascii=False)

with open(os.path.join(MODEL_DIR, "model_info.txt"), "w", encoding="utf-8") as f:
    f.write("Modelo: EfficientNet-B4 (Transfer Learning via timm)\n")
    f.write("Framework: PyTorch + timm\n")
    f.write("Dataset: Kaggle Cassava Leaf Disease Classification\n")
    f.write("URL: https://www.kaggle.com/c/cassava-leaf-disease-classification\n")
    f.write("Imagenes: 21,367 etiquetadas por NaCRRI + Makerere University AI Lab\n")
    f.write("Clases: 5 (CBB, CBSD, CGM, CMD, Healthy)\n")
    f.write("Precision aprox: ~91% en test set\n")
    f.write("Inferencia CPU: ~100-300ms por imagen\n")
    f.write("\nProyectos de referencia:\n")
    f.write("  https://github.com/kozodoi/Kaggle_Leaf_Disease_Classification\n")
    f.write("  https://github.com/Lwhieldon/Cassava-Leaf-Disease-Classification\n")
    f.write("  https://github.com/owenpb/Kaggle-Cassava-Leaf-Classification\n")

print("Archivos generados: class_indices.json, model_info.txt")
print("\nPARA OBTENER LOS PESOS DEL MODELO (.pth):")
print("  1. https://www.kaggle.com/c/cassava-leaf-disease-classification/code")
print("  2. Google Colab: https://github.com/kozodoi/Kaggle_Leaf_Disease_Classification")
print(f"\nGuardar como: {MODEL_DIR}/efficientnet_cassava.pth")

if __name__ == "__main__":
    pass
