import {
  CameraMode,
  CameraType,
  CameraView,
  useCameraPermissions,
} from "expo-camera";
import { useRef, useState, useEffect } from "react";
import { Button, Pressable, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import Ionicons from '@expo/vector-icons/Ionicons';


export default function App() {
  const [permission, requestPermission] = useCameraPermissions();
  const ref = useRef<CameraView>(null);
  const [uri, setUri] = useState<string | null>(null);
  const [facing, _] = useState<CameraType>("front");
  const [accessGranted, setAccessGranted] = useState<boolean | null>(null);
  const [accessStatus, setAccessStatus] = useState<"capturing" | "granted" | "denied">("capturing");

   const takePicture = async () => {
    const photo = await ref.current?.takePictureAsync();
    setUri(photo?.uri);

    const resultado = Math.random() < 0.5;
    setAccessGranted(resultado);
   };
  
  useEffect(() => {
    if (!permission) return;
    if (!permission.granted) requestPermission();

  }, [permission?.granted]);
  
  const getBackgroundColor = () => {
    if (accessGranted === true) return "green";
    if (accessGranted === false) return "red";
    return "#ffffff";
  };

  if (!permission) {
    return null;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: "center" }}>
          We need your permission to use the camera
        </Text>
        <Button onPress={requestPermission} title="Grant permission" />
      </View>
    );
  }

const renderCamera = () => (
  <CameraView
    style={styles.camera}
    ref={ref}
    facing={facing}
    mute={false}
    animateShutter={false}
    responsiveOrientationWhenOrientationLocked
  >
    <View style={styles.overlay}>
        <View style={styles.ovalFrame} />
        {accessGranted !== null && (
        <View style={styles.statusContainer}>
          <Text
            style={[
              styles.statusText,
              { color: accessGranted ? "green" : "red" },
            ]}
          >
            {accessGranted ? "Success" : "Denied"}
          </Text>
        </View>
        )}
      </View>
      <View style={styles.shutterContainer}>
        <Pressable onPress={takePicture} style={styles.shutterBtn}>
          <Ionicons name="camera" size={50} color="black" />
        </Pressable>
      </View>
      </CameraView>
  );

return (

    <View style={[styles.container, { backgroundColor: getBackgroundColor() }]}>
      <View style={styles.maskBackground} />

      <View style={styles.maskHole}>
        <CameraView
          style={styles.cameraInOval}
          ref={ref}
          facing={facing}
          mute={false}
          animateShutter={false}
          responsiveOrientationWhenOrientationLocked
        />
      </View>

          {/* Estado dinámico */}
          {accessGranted === null && (
            <View style={styles.statusContainer}>
              <Ionicons name="camera" size={30} color="green" />
              <Text style={styles.statusCapturing}>Capturando...</Text>
            </View>
          )}

          {accessGranted === true && (
            <View style={styles.statusContainer}>
              <Ionicons name="checkmark-circle" size={50} color="green" />
              <Text style={[styles.statusText, { color: "green" }]}>
                Access Success
              </Text>
            </View>
          )}

          {accessGranted === false && (
            <View style={styles.statusContainer}>
              <Ionicons name="close-circle" size={50} color="red" />
              <Text style={[styles.statusText, { color: "red" }]}>
                Access Denied
              </Text>
            </View>
          )}

        {/* Botón de disparo */}
      <View style={styles.shutterContainer}>
        <Pressable onPress={takePicture} style={styles.shutterBtn}>
          <Ionicons name="camera" size={50} color="black" />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  maskBackground: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
  maskHole: {
    width: 300,
    height: 450,
    borderRadius: 200,
    overflow: "hidden",
    position: "absolute",
    top: "20%",
    alignSelf: "center",
    zIndex: 2,
    backgroundColor: "black",
  },
  cameraInOval: {
    width: 300,
    height: 450,
  },
  statusContainer: {
    position: "absolute",
    bottom: 130,
    alignSelf: "center",
    backgroundColor: "white",
    borderRadius: 15,
    padding: 15,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 3,
  },
  statusText: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 5,
  },
  statusCapturing: {
    fontSize: 20,
    color: "green",
    marginTop: 10,
  },
  shutterContainer: {
    position: "absolute",
    bottom: 44,
    left: 0,
    right: 0,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 3,
  },
  shutterBtn: {
    backgroundColor: "white",
    borderWidth: 5,
    borderColor: "black",
    width: 85,
    height: 85,
    borderRadius: 45,
    alignItems: "center",
    justifyContent: "center",
  },
});
