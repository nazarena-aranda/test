import {
    CameraType,
    CameraView, 
    useCameraPermissions,
} from "expo-camera";
import { useRef, useState, useEffect } from "react";
import { Button, Text, View, ActivityIndicator, Alert } from "react-native";
import { Image } from "expo-image";
import * as FileSystem from 'expo-file-system';
import styles from '../Styles/LoginStyle'; // Importa los estilos

export default function LoginScreen({ navigation }) {
    const [permission, requestPermission] = useCameraPermissions();
    const ref = useRef<CameraView>(null);
    const [uri, setUri] = useState<string | null>(null);
    const [facing, _] = useState<CameraType>("front");
    const [isProcessingOrUploading, setIsProcessingOrUploading] = useState(false);

    const CAPTURE_INTERVAL_MS = 2000;
    const BACKEND_PROCESS_URL = 'http://localhost:5001/api/zonamerica/login';

    const captureAndSendToBackend = async () => {
        if (isProcessingOrUploading || uri) {
            return;
        }

        setIsProcessingOrUploading(true);

        try {
            const photo = await ref.current?.takePictureAsync({ quality: 0.9 });

            if (photo?.uri) {
                const formData = new FormData();
                formData.append('ImageFile', {
                    uri: photo.uri,
                    name: `camera_photo_${Date.now()}.jpg`,
                    type: 'image/jpeg',
                } as any);

                const response = await fetch(BACKEND_PROCESS_URL, {
                    method: 'POST',
                    body: formData,
                });

                if (response.ok) {
                    const responseData = await response.json();
                    if (responseData.faceDetected) {
                        navigation.navigate("Register");
                        setUri(photo.uri);
                        Alert.alert("Éxito", "Cara detectada y procesada por el servidor.");
                    }
                } else {
                    const errorText = await response.text();
                    Alert.alert("Server Error", `Error: ${errorText}`);
                }
            }
        } catch (error) {
            Alert.alert("Connection Error", "No se pudo conectar con el servidor.");
        } finally {
            setIsProcessingOrUploading(false);
        }
    };

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
            <View style={styles.container}>
                <Text style={styles.title}>Necesitamos permisos para usar la cámara.</Text>
                <Button onPress={requestPermission} title="Conceder permisos" />
            </View>
        );
    }

    const renderPicture = () => (
        <View style={styles.pictureContainer}>
            <Image
                source={uri ? { uri } : undefined}
                contentFit="contain"
                style={styles.image}
            />
            <Button onPress={() => setUri(null)} title="Tomar otra foto" />
        </View>
    );

    const renderCamera = () => (
        <CameraView
            style={styles.camera}
            ref={ref}
            facing={facing}
            mute={false}
            animateShutter={false}
            responsiveOrientationWhenOrientationLocked
        >
            <View style={styles.shutterContainer}>
                {isProcessingOrUploading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="small" color="#00ff00" />
                        <Text style={styles.loadingText}>Enviando al servidor...</Text>
                    </View>
                ) : (
                    <Text style={styles.waitingText}>Esperando detección...</Text>
                )}
            </View>
        </CameraView>
    );

    return (
        <View style={styles.container}>
            {uri ? renderPicture() : renderCamera()}
        </View>
    );
}