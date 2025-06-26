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
import Styles from '../Styles/LoginStyle'; // Importa los estilos
import TokenManager from "../utils/TokenManager";


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
      ? "http://172.20.10.11:5001/api/zonamerica/biometric"
      : "http://172.20.10.11:5001/api/zonamerica/login";

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

        const token = TokenManager.getToken();

        const response = await fetch(BACKEND_PROCESS_URL, {
          method: "POST",
          headers: {
            'Authorization': `Bearer ${token}`
          },
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
        let timer: any;
        if (permission?.granted && !uri && !isProcessingOrUploading) {
            timer = setInterval(() => {
                captureAndSendToBackend();
            }, CAPTURE_INTERVAL_MS);
        }

        return () => {
            if (timer) {
                clearInterval(timer);
            }
        };
    }, [permission?.granted, uri, isProcessingOrUploading]);

    if (!permission) {
        return null;
    }

    if (!permission.granted) {
        return (
            <View style={Styles.container}>
                <Text style={Styles.title}>Necesitamos permisos para usar la cámara.</Text>
                <Button onPress={requestPermission} title="Conceder permisos" />
            </View>
        );
    }

    const renderPicture = () => (
        <View style={Styles.pictureContainer}>
            <Image
                source={uri ? { uri } : undefined}
                contentFit="contain"
                style={Styles.image}
            />
            <Button onPress={() => setUri(null)} title="Tomar otra foto" />
        </View>
    );

    const renderCamera = () => (
        <CameraView
            style={Styles.camera}
            ref={ref}
            facing={facing}
            mute={false}
            animateShutter={false}
            responsiveOrientationWhenOrientationLocked
        >
            <View style={Styles.shutterContainer}>
                {isProcessingOrUploading ? (
                    <View style={Styles.loadingContainer}>
                        <ActivityIndicator size="small" color="#00ff00" />
                        <Text style={Styles.loadingText}>Enviando al servidor...</Text>
                    </View>
                ) : (
                    <Text style={Styles.waitingText}>Esperando detección...</Text>
                )}
            </View>
        </CameraView>
    );

    return (
        <View style={Styles.container}>
            {uri ? renderPicture() : renderCamera()}
        </View>
    );
}
