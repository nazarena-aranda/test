import cv2
import dlib
import numpy as np
from pymongo import MongoClient
import certifi
import os

# Ingreso 
nombre = input("Ingresá tu nombre: ")
archivo = input("Ingresá el nombre del archivo (ej: naza.jpg): ")

# Cargar imagen
ruta_imagen = os.path.join("fotos", archivo)
image = cv2.imread(ruta_imagen)
if image is None:
    print("❌ No se pudo cargar la imagen:", ruta_imagen)
    exit()

# Modelos
predictor = dlib.shape_predictor("models/shape_predictor_68_face_landmarks.dat")
face_rec_model = dlib.face_recognition_model_v1("models/dlib_face_recognition_resnet_model_v1.dat")
detector = dlib.get_frontal_face_detector()

# Detección
gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
faces = detector(gray)
if len(faces) == 0:
    print("❌ No se detectaron caras.")
    exit()

shape = predictor(gray, faces[0])
vector = face_rec_model.compute_face_descriptor(image, shape)
vector_np = np.array(vector)

# Conexión a MongoDB Atlas
client = MongoClient(
    "mongodb+srv://nazarenaaranda15:test.123@cluster0.gg7oqjf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
    tlsCAFile=certifi.where()
)
db = client["zona_face"]
collection = db["usuarios"]

# Guardar en Mongo
doc = {
    "nombre": nombre,
    "vector": vector_np.tolist()
}
collection.insert_one(doc)
print(f"✅ Vector de '{nombre}' guardado correctamente.")
