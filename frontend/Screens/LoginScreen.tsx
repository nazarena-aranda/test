import {
  CameraType,
  CameraView, 
  useCameraPermissions,
} from "expo-camera";
import { useRef, useState, useEffect } from "react";
import { Button, StyleSheet, Text, View, ActivityIndicator, Alert } from "react-native";
import { Image } from "expo-image";
import * as FileSystem from 'expo-file-system';

export default function LoginScreen({ navigation }) {
  // permisos de la cámara
  const [permission, requestPermission] = useCameraPermissions();
  const ref = useRef<CameraView>(null);
  const [uri, setUri] = useState<string | null>(null);
  // camera (front by default)
  const [facing, _] = useState<CameraType>("front");

  const [isProcessingOrUploading, setIsProcessingOrUploading] = useState(false);

  // Interval to take photos every 2 seconds
  const CAPTURE_INTERVAL_MS = 2000;

  const BACKEND_PROCESS_URL = 'http://localhost:5001/api/zonamerica/login';

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
        console.log("Photo taken, sending as a file to the backend...");
        console.log("Your photo has the following URI:", photo.uri);

        const fileUriToSend = photo.uri; // Use the URI of the captured photo
        const fileNameExtension = '.jpg';
        const fileMimeType = 'image/jpeg';

        // Create a FormData object to send the image as a file
        const formData = new FormData();

        formData.append('ImageFile', {
          uri: fileUriToSend,
          name: `camera_photo_${Date.now()}${fileNameExtension}`,
          type: fileMimeType, // tipo MIME de la imagen (JPEG o PNG)
        } as any); // 'as any' is necessary for TypeScript typing

        console.log("Sending FormData to the backend...");

        // Make the HTTP POST request to the backend
        const response = await fetch(BACKEND_PROCESS_URL, {
          method: 'POST',
          headers: {
          },
          body: formData, // Send the FormData object
        });

        if (response.ok) {
          const responseData = await response.json();
          console.log("Backend response:", responseData);

          // Check if the backend detected a face (based on the 'faceDetected' property)
          if (responseData.faceDetected) {
            navigation.navigate("Register");
            console.log("¡Cara detectada por el backend! Mostrando foto.");
            setUri(photo.uri); // Muestra la foto local si se detectó una cara
            Alert.alert("Éxito", "Cara detectada y procesada por el servidor.");
            // Si tu backend devuelve más datos (ej. vectores faciales), puedes usarlos aquí
            // console.log("Vectores de cara:", responseData.faceVectors);
          } else {
            console.log("No face detected by the backend. Discarding photo.");
            // If no face is detected, we don't show the photo and the camera keeps searching.
          }
        } else {
          // If the response was not successful, read the error message from the backend
          const errorText = await response.text();
          console.error("Backend error processing photo:", response.status, errorText);
          Alert.alert("Server Error", `Could not process photo on server. Code: ${response.status}. Message: ${errorText}`);
        }
      } else {
        console.warn("Could not obtain photo URI. Is the camera ready?");
      }
    } catch (error) {
      // Capture and handle any errors during photo capture or sending
      console.error("Error capturing or sending photo:", error);
      Alert.alert("Connection Error", "Could not connect to server or there was an error processing the photo.");
    } finally {
      // Always reset processing state when finished (success or error)
      setIsProcessingOrUploading(false);
    }
  };

  // Effect that runs to start the automatic capture timer
  useEffect(() => {
    let timer: any;
    // El temporizador solo se inicia si tenemos permiso, no hay una foto mostrándose
    // y no estamos ya procesando/subiendo una imagen.
    if (permission?.granted && !uri && !isProcessingOrUploading) {
      timer = setInterval(() => {
        captureAndSendToBackend(); // Call the capture and send function
      }, CAPTURE_INTERVAL_MS);
    }

    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [permission?.granted, uri, isProcessingOrUploading]); // UseEffect dependencies

  // Render null or a loading indicator while permissions are being obtained
  if (!permission) {
    return null;
  }

  // If permissions are not granted, prompt the user to grant them
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: "center", color: 'white' }}>
          We need your permission to use the camera.
        </Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }


  const renderPicture = () => {
    return (
      <View style={styles.pictureContainer}>
        <Image
        source={uri ? { uri } : undefined}
          contentFit="contain" // Ajusta la imagen dentro de los límites
          style={{ width: 300, aspectRatio: 1 }}
        />
        {/* Button to return to the camera */}
        <Button onPress={() => setUri(null)} title="Take another photo" />
      </View>
    );
  };


  const renderCamera = () => {
    return (
      <CameraView
        style={styles.camera} // Styles to make the camera take up all available space
        ref={ref} 
        facing={facing} 
        mute={false} 
        animateShutter={false} 
        responsiveOrientationWhenOrientationLocked 
      >
        <View style={styles.shutterContainer}>
          {isProcessingOrUploading ? (
            // Loading indicator when sending/processing the photo
            <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)', padding: 10, borderRadius: 5 }}>
              <ActivityIndicator size="small" color="#00ff00" />
              <Text style={{ color: 'white', marginLeft: 10 }}>
                Sending to server...
              </Text>
            </View>
          ) : (
            // Message when the camera is waiting for detection
            <Text style={{ color: 'white', fontSize: 16, backgroundColor: 'rgba(0,0,0,0.5)', padding: 10, borderRadius: 5 }}>
                Waiting for detection...
            </Text>
          )}
        </View>
      </CameraView>
    );
  };

  // Conditional rendering: show the photo if there is a URI, otherwise show the camera
  return (
    <View style={styles.container}>
      {uri ? renderPicture() : renderCamera()}
    </View>
  );
}

// Application styles
const styles = StyleSheet.create({
  container: {
    flex: 1, // Occupies all available space
    backgroundColor: "#000", // Black background
    alignItems: "center", // Centers elements horizontally
    justifyContent: "center", // Centers elements vertically
  },
  pictureContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#000",
  },
  camera: {
    flex: 1,
    width: "100%", // The camera takes up the full width
  },
  shutterContainer: {
    position: "absolute", // Absolute positioning over the camera
    bottom: 44, // 44 units from the bottom
    left: 0,
    width: "100%", // Occupies the full width
    alignItems: "center", // Centers content horizontally
    flexDirection: "row",
    justifyContent: "center", // Center the status message
    paddingHorizontal: 30, // Horizontal padding
  },
});