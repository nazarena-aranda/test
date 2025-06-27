import {
  CameraType,
  CameraView, 
  useCameraPermissions,
} from "expo-camera";
import { useRef, useState, useEffect } from "react";
import { useRoute, useNavigation, RouteProp } from "@react-navigation/native";
import { Button, StyleSheet, Text, View, ActivityIndicator, Alert } from "react-native";
import { Image } from "expo-image";
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Styles from '../Styles/LoginStyle';
import TokenManager from "../utils/TokenManager";
import * as ImageManipulator from 'expo-image-manipulator';

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
  const [permission, requestPermission] = useCameraPermissions();
  const ref = useRef<CameraView>(null);
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const route = useRoute<LoginScreenRouteProp>();
  const { mode = "login", tipoDoc, valorDoc } = route.params || {};
  const [uri, setUri] = useState<string | null>(null);
  const [facing] = useState<CameraType>("front");
  const [isProcessingOrUploading, setIsProcessingOrUploading] = useState(false);
  const [hasFinished, setHasFinished] = useState(false);

  const BACKEND_PROCESS_URL =
    mode === "biometric"
      ? "http://172.20.10.11:5001/api/zonamerica/biometric"
      : "http://172.20.10.11:5001/api/zonamerica/login";

  const CAPTURE_INTERVAL_MS = 2000;

  const captureAndSendToBackend = async () => {
  if (isProcessingOrUploading || uri || hasFinished) return;

  setIsProcessingOrUploading(true);

  try {
    const photo = await ref.current?.takePictureAsync({ quality: 0.9 });

    if (photo?.uri) {
      console.log("Foto tomada:", photo.uri);

      // 👇 Invertir horizontalmente la imagen (espejo)
      const manipulatedPhoto = await ImageManipulator.manipulateAsync(
        photo.uri,
        [{ flip: ImageManipulator.FlipType.Horizontal }],
        { compress: 1, format: ImageManipulator.SaveFormat.JPEG }
      );

      const formData = new FormData();
      formData.append(
        mode === "biometric" ? "file" : "ImageFile",
        {
          uri: manipulatedPhoto.uri,
          name: `camera_photo_${Date.now()}.jpg`,
          type: 'image/jpeg',
        } as any
      );

      const token = await TokenManager.getToken();
      console.log("Token:", token);

      const response = await fetch(BACKEND_PROCESS_URL, {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();

        if (mode === "biometric" && !hasFinished) {
          setHasFinished(true);
          setUri(manipulatedPhoto.uri); // mostrar imagen invertida
        } else if (mode === "login") {
          Alert.alert("Acceso concedido", "Tu cara fue reconocida.");
          setUri(manipulatedPhoto.uri);
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


  useEffect(() => {
    let timer: any;
    if (permission?.granted && !uri && !isProcessingOrUploading && !hasFinished) {
      timer = setInterval(() => {
        captureAndSendToBackend();
      }, CAPTURE_INTERVAL_MS);
    }
    return () => timer && clearInterval(timer);
  }, [permission?.granted, uri, isProcessingOrUploading, hasFinished]);

  if (!permission) return null;

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
      {mode === 'biometric' ? (
        <>
          <Text style={{ textAlign: 'center', marginVertical: 10 }}>
            Esta es la imagen que se registró para tu rostro.
          </Text>
          <Button title="Listo" onPress={() => navigation.navigate<any>("Welcome")} />
        </>
      ) : (
        <Button title="Tomar otra foto" onPress={() => setUri(null)} />
      )}
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
