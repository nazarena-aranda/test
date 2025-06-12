// Screens/AccessScreen.js

import React, { useRef, useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { Camera } from 'expo-camera';
import Styles from '../Styles/AccessStyle';

export default function AccessScreen({ navigation }) {
  const cameraRef = useRef(null);
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraReady, setCameraReady] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleLogin = async () => {
    if (cameraRef.current && cameraReady) {
      const photo = await cameraRef.current.takePictureAsync({ base64: true });

      try {
        const response = await fetch('http://172.31.63.149:8081', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ image: photo.base64 }),
        });

        const data = await response.json();

        if (data?.access === 'granted') {
          navigation.navigate('SuccessScreen', { user: data.user });
        } else {
          navigation.navigate('DeniedScreen');
        }
      } catch (error) {
        console.error(error);
        Alert.alert('Error', 'Ocurrió un error al procesar la imagen.');
      }
    }
  };

  if (hasPermission === null) {
    return (
      <View style={Styles.container}>
        <Text style={Styles.permissionText}>Solicitando permisos...</Text>
      </View>
    );
  }

  if (!hasPermission) {
    return (
      <View style={Styles.container}>
        <Text style={Styles.permissionText}>No se puede acceder a la cámara</Text>
      </View>
    );
  }

  return (
    <View style={Styles.container}>
      <Camera
        ref={cameraRef}
        style={Styles.camera}
        type={Camera.Constants.Type.front}
        onCameraReady={() => setCameraReady(true)}
      >
        <View style={Styles.frame}>
          <Text style={Styles.text}>Colocá tu rostro dentro del marco</Text>
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