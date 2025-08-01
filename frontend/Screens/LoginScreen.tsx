import {
  CameraView,
  useCameraPermissions,
} from "expo-camera";
import { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useRoute, useNavigation, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as ImageManipulator from "expo-image-manipulator";
import TokenManager from "../utils/TokenManager";
import { styles } from "../Styles/LoginStyle";
import AsyncStorage from '@react-native-async-storage/async-storage';

type RootStackParamList = {
  LoginScreen: {
    mode: "login" | "biometric";
    tipoDoc?: string;
    valorDoc?: string;
  };
  Welcome: undefined;
};

type LoginScreenRouteProp = RouteProp<RootStackParamList, "LoginScreen">;
type LoginScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "LoginScreen"
>;

export default function LoginScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [flashOverlay, setFlashOverlay] = useState(false);
  const ref = useRef<CameraView>(null);
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const route = useRoute<LoginScreenRouteProp>();
  const { mode = "login", tipoDoc, valorDoc } = route.params || {};
  const [isProcessingOrUploading, setIsProcessingOrUploading] = useState(false);
  const [hasFinished, setHasFinished] = useState(false);
  const [accessGranted, setAccessGranted] = useState<boolean | null>(null);
  const [deniedAttempts, setDeniedAttempts] = useState(0);
  const [showManualButton, setShowManualButton] = useState(false);
  const [flashOn, setFlashOn] = useState(false);


  const BACKEND_PROCESS_URL =
    mode === "biometric"
      ? "http://172.20.10.11:5001/api/zonamerica/biometric"
      : "http://172.20.10.11:5001/api/zonamerica/login";

  const CAPTURE_INTERVAL_MS = 2000;

  const getBackgroundColor = () => {
    if (accessGranted === true) return "#BCECD3";
    if (accessGranted === false && showManualButton) return "#FEBDB1";
    if (accessGranted === false) return "#FEBDB1";

    return "#FAF9F9";
  };

const captureAndSendToBackend = async () => {
  if (isProcessingOrUploading || hasFinished) return;

  setIsProcessingOrUploading(true);

  try {
    setFlashOverlay(true);
    await new Promise(resolve => setTimeout(resolve, 100));

    const photo = await ref.current?.takePictureAsync({ quality: 0.9 });

    if (photo?.uri) {
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
          type: "image/jpeg",
        } as any
      );

      // ⬇️ Agregar doorQR si es login
      if (mode === "login") {
        const storedDoor = await AsyncStorage.getItem("puerta");
        if (storedDoor) {
          formData.append("doorQR", storedDoor);
        } else {
          console.warn("⚠️ No se encontró la puerta en AsyncStorage.");
        }
      }

      const token = await TokenManager.getToken();

      const response = await fetch(BACKEND_PROCESS_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        setAccessGranted(true);
        setHasFinished(true);
        setTimeout(() => navigation.navigate("Welcome"), 2000);
      } else {
        setAccessGranted(false);

        if (mode === "login") {
          setDeniedAttempts((prev) => {
            const updated = prev + 1;
            if (updated >= 3) {
              setShowManualButton(true);
            }
            return updated;
          });
        }

        setTimeout(() => {
          setAccessGranted(null);
        }, 2000);
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
    if (mode === "biometric") {
      setShowManualButton(true);
    }
  }, [mode]);

  useEffect(() => {
    let timer: any;

    if (
      mode === "login" &&
      permission?.granted &&
      !isProcessingOrUploading &&
      !hasFinished &&
      !showManualButton
    ) {
      timer = setInterval(captureAndSendToBackend, CAPTURE_INTERVAL_MS);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [mode, permission?.granted, isProcessingOrUploading, hasFinished, showManualButton]);

  const handleManualCapture = () => {
    setShowManualButton(false);
    setDeniedAttempts(0);
    captureAndSendToBackend();
  };

  if (!permission) return null;

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text>Necesitamos permiso para usar la cámara</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, {
      backgroundColor: getBackgroundColor()
    }]}>  

    <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
      <Ionicons name="arrow-back" size={30} color="black" />
    </TouchableOpacity>
    <TouchableOpacity style={styles.flashToggleButton} onPress={() => setFlashOn(!flashOn)}>
      <Ionicons name={flashOn ? "flash" : "flash-off"} size={30} color="black" />
    </TouchableOpacity>

    <View style={styles.maskBackground} />
      <View style={styles.ovalWrapper}>
        <View style={styles.maskHole}>
          <CameraView
            style={styles.cameraInOval}
            ref={ref}
            facing="front"
            mute={false}
            animateShutter={false}
            responsiveOrientationWhenOrientationLocked
          />
        </View>
      </View>

      {isProcessingOrUploading && (
        <>
          <View style={{ alignItems: 'center' }}>
            <ActivityIndicator size="large" color="green" />
            <Text style={styles.capturingText}>Capturando...</Text>
          </View>
        </>
      )}

      {accessGranted === true && (
        <View style={[styles.statusContainer, styles.grantedBackground]}>
          <View style={{ alignItems: 'center' }}>
            <Text style={[styles.statusText, styles.grantedText]}>
              {mode === "biometric" ? "Escaneo Exitoso" : "Acceso Permitido"}
            </Text>
            <Ionicons name="checkmark-circle" size={50} color="#4CCD89" style={{ marginTop: 5 }} />
          </View>
        </View>
      )}

      {accessGranted === false && !showManualButton && (
        <View style={[styles.statusContainer, styles.deniedBackground]}>
          <View style={{ alignItems: 'center' }}>
            <Text style={[styles.statusText, styles.deniedText]}>
              Acceso denegado
            </Text>
            <Ionicons name="close-circle" size={50} color="#FD7A64" style={{ marginTop: 5 }}/>
          </View>
        </View>
      )}

      {showManualButton && (
        <View style={{ alignItems: 'center' }}>
          <TouchableOpacity onPress={handleManualCapture} style={styles.manualButton}>
            <Ionicons name="camera" style={styles.manualIcon} />
          </TouchableOpacity>
        </View>
      )}
      {flashOn && (
        <View style={styles.flashOverlay} pointerEvents="none" />
      )}
    </View>
  );
}
