import React, { useRef, useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import Styles from '../Styles/AccessStyle';

console.log('CameraType', CameraType);
console.log('CameraType.front', CameraType.front);

export default function AccessScreen({ navigation }) {
    const cameraRef = useRef(null);
    const [hasPermission, setHasPermission] = useState(null);

    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    } , []);

    const handleLogin = async () => {
        if (cameraRef.current) {
            const photo = await cameraRef.current.takePictureAsync({ base64: true });

            try {
                const response = await fetch('http://172.31.63.149:8081', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        image: photo.base64,
                    }),
                });

                const data = await response.json();

                if (data.access === 'granted') {
                    navigation.navigate('SuccesScreen', { user: data.user });
                } else {
                    navigation.navigate('DeniedScreen');
                }
            } catch (error) {
                console.error('Error:', error);
                Alert.alert('Error', 'An error occurred while processing the image.');
            }
        }
    };

    if (hasPermission === null) {
        return (
            <View style={Styles.container}>
                <Text style={Styles.permissionText}>Solicitando permiso de cámara...</Text>
            </View>
        );
    }
    if (!hasPermission) {
        return (
            <View style={Styles.container}>
                <Text style={Styles.permissionText}>No access to camera</Text>
            </View>
        );
    }

    return (
        <View style={Styles.container}>
            <Camera style={Styles.camera} ref={cameraRef} type={CameraType.front}>
                <View style={Styles.frame}>
                    <Text style={Styles.text}>Coloca tu rostro dentro del marco</Text>
                </View>
                <View style={Styles.buttonContainer}>
                    <TouchableOpacity style={Styles.button} onPress={handleLogin}>
                        <Text style={Styles.buttonText}>Iniciar sesión</Text>
                    </TouchableOpacity>
                </View>
            </Camera>
        </View>
    );
}