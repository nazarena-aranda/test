import {
  CameraType,
  CameraView, 
  useCameraPermissions,
} from "expo-camera";
import { useRef, useState, useEffect } from "react";
import { Button, StyleSheet, Text, View, ActivityIndicator, Alert } from "react-native";
import { Image } from "expo-image";
import * as FileSystem from 'expo-file-system';

export default function App() {
  // permisos de la cámara
  const [permission, requestPermission] = useCameraPermissions();
  const ref = useRef<CameraView>(null);
  const [uri, setUri] = useState<string | null>(null);
  // cámara (frontal por defecto)
  const [facing, _] = useState<CameraType>("front");

  const [isProcessingOrUploading, setIsProcessingOrUploading] = useState(false);

  // Intervalo de tiempo para tomar fotos cada 2 segundos
  const CAPTURE_INTERVAL_MS = 2000;

  const BACKEND_PROCESS_URL = 'http://localhost:5001/api/zonamerica/login'; 

  // capturar la foto y enviarla al backend
  const captureAndSendToBackend = async () => {
    // evita que siga tomando fotos si ya estamos procesando o si ya hay una foto mostrándose
    if (isProcessingOrUploading || uri) {
      return;
    }

    setIsProcessingOrUploading(true);

    try {
      // `takePictureAsync` devuelve un objeto `photo` que contiene la `uri8
      const photo = await ref.current?.takePictureAsync({
        quality: 0.9,
      });

      // si se tomó la foto y tenemos su URI local
      if (photo?.uri) {
        console.log("Foto tomada, enviando como archivo al backend...");
        console.log("Tu foto tiene la siguiente URI:", photo.uri);


        const fileUriToSend = photo.uri; // Usamos directamente la URI de la foto capturada
        const fileNameExtension = '.jpg';
        const fileMimeType = 'image/jpeg';


        // Crea un objeto FormData para enviar la imagen como un archivo
        const formData = new FormData();
     
        formData.append('ImageFile', {
          uri: fileUriToSend,
          name: `camera_photo_${Date.now()}${fileNameExtension}`,
          type: fileMimeType, // tipo MIME de la imagen (JPEG o PNG)
        } as any); // 'as any' es necesario para el tipado de TypeScript


        console.log("Enviando FormData al backend...");

        // realiza la solicitud HTTP POST al backend
        const response = await fetch(BACKEND_PROCESS_URL, {
          method: 'POST',
          headers: {
          },
          body: formData, // envía el objeto FormData
        });

        if (response.ok) {
          const responseData = await response.json();
          console.log("Respuesta del backend:", responseData);

          // Verifica si el backend detectó una cara (según la propiedad 'faceDetected')
          if (responseData.faceDetected) {
            console.log("¡Cara detectada por el backend! Mostrando foto.");
            setUri(photo.uri); // Muestra la foto local si se detectó una cara
            Alert.alert("Éxito", "Cara detectada y procesada por el servidor.");
            // Si tu backend devuelve más datos (ej. vectores faciales), puedes usarlos aquí
            // console.log("Vectores de cara:", responseData.faceVectors);
          } else {
            console.log("No se detectó ninguna cara por el backend. Descartando foto.");
            // Si no se detecta una cara, no mostramos la foto y la cámara seguirá buscando.
          }
        } else {
          // Si la respuesta no fue exitosa, lee el mensaje de error del backend
          const errorText = await response.text();
          console.error("Error del backend al procesar la foto:", response.status, errorText);
          Alert.alert("Error del Servidor", `No se pudo procesar la foto en el servidor. Código: ${response.status}. Mensaje: ${errorText}`);
        }
      } else {
        console.warn("No se pudo obtener la URI de la foto. ¿La cámara está lista?");
      }
    } catch (error) {
      // Captura y maneja cualquier error durante la captura o el envío de la foto
      console.error("Error al capturar o enviar la foto:", error);
      Alert.alert("Error de Conexión", "No se pudo conectar con el servidor o hubo un error al procesar la foto.");
    } finally {
      // Siempre resetea el estado de procesamiento al finalizar (éxito o error)
      setIsProcessingOrUploading(false);
    }
  };

  // Efecto que se ejecuta para iniciar el temporizador de captura automática
  useEffect(() => {
    let timer: NodeJS.Timeout;
    // El temporizador solo se inicia si tenemos permiso, no hay una foto mostrándose
    // y no estamos ya procesando/subiendo una imagen.
    if (permission?.granted && !uri && !isProcessingOrUploading) {
      timer = setInterval(() => {
        captureAndSendToBackend(); // Llama a la función de captura y envío
      }, CAPTURE_INTERVAL_MS);
    }

    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [permission?.granted, uri, isProcessingOrUploading]); // Dependencias del useEffect

  // Renderiza null o un indicador de carga mientras se obtienen los permisos
  if (!permission) {
    return null;
  }

  // Si los permisos no están concedidos, pide al usuario que los conceda
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: "center", color: 'white' }}>
          Necesitamos tu permiso para usar la cámara.
        </Text>
        <Button onPress={requestPermission} title="Conceder permiso" />
      </View>
    );
  }


  const renderPicture = () => {
    return (
      <View style={styles.pictureContainer}>
        <Image
          source={{ uri }}
          contentFit="contain" // Ajusta la imagen dentro de los límites
          style={{ width: 300, aspectRatio: 1 }}
        />
        {/* Botón para volver a la cámara */}
        <Button onPress={() => setUri(null)} title="Tomar otra foto" />
      </View>
    );
  };


  const renderCamera = () => {
    return (
      <CameraView
        style={styles.camera} // Estilos para que la cámara ocupe todo el espacio disponible
        ref={ref} 
        facing={facing} 
        mute={false} 
        animateShutter={false} 
        responsiveOrientationWhenOrientationLocked 
      >
        <View style={styles.shutterContainer}>
          {isProcessingOrUploading ? (
            // Indicador de carga cuando se está enviando/procesando la foto
            <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)', padding: 10, borderRadius: 5 }}>
              <ActivityIndicator size="small" color="#00ff00" />
              <Text style={{ color: 'white', marginLeft: 10 }}>
                Enviando a servidor...
              </Text>
            </View>
          ) : (
            // Mensaje cuando la cámara está esperando detección
            <Text style={{ color: 'white', fontSize: 16, backgroundColor: 'rgba(0,0,0,0.5)', padding: 10, borderRadius: 5 }}>
                Esperando detección...
            </Text>
          )}
        </View>
      </CameraView>
    );
  };

  // Renderizado condicional: muestra la foto si hay una URI, si no, muestra la cámara
  return (
    <View style={styles.container}>
      {uri ? renderPicture() : renderCamera()}
    </View>
  );
}

// Estilos de la aplicación
const styles = StyleSheet.create({
  container: {
    flex: 1, // Ocupa todo el espacio disponible
    backgroundColor: "#000", // Fondo negro
    alignItems: "center", // Centra los elementos horizontalmente
    justifyContent: "center", // Centra los elementos verticalmente
  },
  pictureContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#000",
  },
  camera: {
    flex: 1,
    width: "100%", // La cámara ocupa todo el ancho
  },
  shutterContainer: {
    position: "absolute", // Posicionamiento absoluto sobre la cámara
    bottom: 44, // 44 unidades desde abajo
    left: 0,
    width: "100%", // Ocupa todo el ancho
    alignItems: "center", // Centra horizontalmente el contenido
    flexDirection: "row",
    justifyContent: "center", // Centrar el mensaje de estado
    paddingHorizontal: 30, // Relleno horizontal
  },
});