import {
  CameraType,
  CameraView, 
  useCameraPermissions,
} from "expo-camera";
import { useRef, useState, useEffect } from "react";
import { useRoute, useNavigation, RouteProp } from "@react-navigation/native";
import { Button, StyleSheet, Text, View, ActivityIndicator, Alert } from "react-native";
import { Image } from "expo-image";
import * as FileSystem from 'expo-file-system';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';


type RootStackParamList = {
  LoginScreen: {
    mode: "login" | "biometric";
    tipoDoc?: string;
    valorDoc?: string;
  };
};

type LoginScreenRouteProp = RouteProp<RootStackParamList, "LoginScreen">;
type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, "LoginScreen">;

export default function LoginScreen() {
  // permisos de la cámara
  const [permission, requestPermission] = useCameraPermissions();
  const ref = useRef<CameraView>(null);
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const route = useRoute<LoginScreenRouteProp>();
  const { mode = "login", tipoDoc, valorDoc } = route.params || {};
  const [uri, setUri] = useState<string | null>(null);
  
  // cámara (frontal por defecto)
  const [facing, _] = useState<CameraType>("front");
  const [isProcessingOrUploading, setIsProcessingOrUploading] = useState(false);

  const BACKEND_PROCESS_URL =
    mode === "biometric"
      ? "http://localhost:5001/api/zonamerica/biometric"
      : "http://localhost:5001/api/zonamerica/login";

  // Intervalo de tiempo para tomar fotos cada 2 segundos
  const CAPTURE_INTERVAL_MS = 2000;


  // capture the photo and send it to the backend
  const captureAndSendToBackend = async () => {
    // prevent taking more photos if already processing or if a photo is being displayed
    if (isProcessingOrUploading || uri) {
      return;
    }

    setIsProcessingOrUploading(true);

    try {
      // `takePictureAsync` returns a `photo` object containing the `uri`
      const photo = await ref.current?.takePictureAsync({
        quality: 0.9,
      });

      // si se tomó la foto y tenemos su URI local
      if (photo?.uri) {
        
        console.log("Foto tomada, enviando como archivo al backend...");
        console.log("Tu foto tiene la siguiente URI:", photo.uri);

        const fileUriToSend = photo.uri; // Use the URI of the captured photo
        const fileNameExtension = '.jpg';
        const fileMimeType = 'image/jpeg';

        // Create a FormData object to send the image as a file
        const formData = new FormData();
        
        formData.append(
          mode === "biometric" ? "file" : "ImageFile",
          {
            uri: fileUriToSend,
            name: `camera_photo_${Date.now()}${fileNameExtension}`,
            type: fileMimeType, // tipo MIME de la imagen (JPEG o PNG)
          } as any // 'as any' es necesario para el tipado de TypeScript
        );
        
        console.log("Enviando FormData al backend...");

        if (mode === "biometric") {
          formData.append("tipoDoc", tipoDoc || "");
          formData.append("valorDoc", valorDoc || "");
        }

        const response = await fetch(BACKEND_PROCESS_URL, {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();

          if (mode === "biometric") {
            Alert.alert("Listo", "Tu rostro fue registrado correctamente.");
            navigation.navigate("LoginScreen", { mode: "login" });
          } else {
            Alert.alert("Acceso concedido", "Tu cara fue reconocida.");
            setUri(photo.uri);
          }
        } else {
          const msg = await response.text();
          Alert.alert("Error", msg);
        }
      }
    } catch (err) {
      console.error("Error al enviar foto:", err);
      Alert.alert("Error", "No se pudo conectar con el servidor.");
    } finally {
      setIsProcessingOrUploading(false);
    }
  };
  // Efecto que se ejecuta para iniciar el temporizador de captura automática
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (!uri && !isProcessingOrUploading) {
      timer = setInterval(() => {
        captureAndSendToBackend();
      }, CAPTURE_INTERVAL_MS);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [uri, isProcessingOrUploading]);

  const renderPicture = () => (
    <View style={styles.pictureContainer}>
      <Image
        source={uri ? { uri } : undefined}
        contentFit="contain"
        style={{ width: 300, aspectRatio: 1 }}
      />
      <Button title="Tomar otra foto" onPress={() => setUri(null)} />
    </View>
  );

  const renderCamera = () => (
    <CameraView
      style={styles.camera}
      ref={ref}
      facing="front"
      mute={false}
      animateShutter={false}
    >
      <View style={styles.shutterContainer}>
        {isProcessingOrUploading ? (
          <ActivityIndicator size="small" color="#00ff00" />
        ) : (
          <Text style={{ color: "white" }}>Esperando detección...</Text>
        )}
      </View>
    </CameraView>
  );

  return <View style={styles.container}>{uri ? renderPicture() : renderCamera()}</View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },
  pictureContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#000",
  },
  camera: {
    flex: 1,
    width: "100%",
  },
  shutterContainer: {
    position: "absolute",
    bottom: 44,
    left: 0,
    width: "100%",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    paddingHorizontal: 30,
  },
});