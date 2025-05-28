import cv2
import dlib
import numpy as np
from pymongo import MongoClient
import certifi
import os
from numpy import dot
from numpy.linalg import norm

# Carpeta de imágenes a comparar
carpeta = "fotos"

#  Modelos
predictor = dlib.shape_predictor("models/shape_predictor_68_face_landmarks.dat")
face_rec_model = dlib.face_recognition_model_v1("models/dlib_face_recognition_resnet_model_v1.dat")
detector = dlib.get_frontal_face_detector()

# Conexión a Mongo Atlas
client = MongoClient(
    "mongodb+srv://nazarenaaranda15:test.123@cluster0.gg7oqjf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
    tlsCAFile=certifi.where()
)
db = client["zona_face"]
collection = db["usuarios"]

# Función para similitud 
def cosine_similarity(v1, v2):
    return dot(v1, v2) / (norm(v1) * norm(v2))

# Recorrer imágenes
for archivo in os.listdir(carpeta):
    if archivo.lower().endswith((".jpg", ".jpeg", ".png")):
        print(f"\n🔎 Analizando imagen: {archivo}")
        ruta = os.path.join(carpeta, archivo)
        image = cv2.imread(ruta)
        if image is None:
            print("❌ No se pudo cargar la imagen:", archivo)
            continue

        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        faces = detector(gray)

        if len(faces) == 0:
            print("❌ No se detectaron caras en:", archivo)
            continue

        shape = predictor(gray, faces[0])
        vector = face_rec_model.compute_face_descriptor(image, shape)
        nuevo_vector = np.array(vector)

        # Buscar similitud con la base de Mongo Atlas
        pipeline = [
            {
                "$search": {
                    "index": "default",
                    "knnBeta": {
                        "vector": nuevo_vector.tolist(),
                        "path": "vector",
                        "k": 1
                    }
                }
            }
        ]

        resultados = list(collection.aggregate(pipeline))
        if resultados:
            match = resultados[0]
            nombre = match["nombre"]
            vector_guardado = np.array(match["vector"])
            similitud = cosine_similarity(nuevo_vector, vector_guardado)
            print(f"🟢 Coincidencia: {nombre} — Similitud: {similitud:.4f} ({similitud * 100:.2f}%)")
        else:
            print("🔴 No se encontró coincidencia.")
