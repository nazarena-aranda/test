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
  const renderPicture = () => {
    return (
      <View>
        <Image
          source={{ uri }}
          contentFit="contain"
          style={{ width: 300, aspectRatio: 1 }}
        />
        <Button onPress={() => setUri(null)} title="Take another picture" />
      </View>
    );
  };

const renderCamera = () => {
  return (
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
          {/* <Text style={styles.shutterBtnText}>Tomar</Text> */}
          <Ionicons name="camera" size={50} color="black" />
        </Pressable>
      </View>
    </CameraView>

  );
};


  return (
    <View style={styles.container}>
      {renderCamera()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  camera: {
    flex: 1,
    width: "100%",
    position: "relative",
  },
  shutterContainer: {
    position: "absolute",
    bottom: 44,
    left: 0,
    right: 0,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
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
  shutterBtnText: {
  color: "black",
  fontSize: 15,
  fontWeight: "bold",
  },
  frame: {
  position: "absolute",
  top: "30%",
  left: "15%",
  width: "70%",
  height: "40%",
  borderWidth: 8,
  borderColor: "white",
  borderRadius: 20,
},

statusContainer: {
  position: "absolute",
  bottom: 130,
  alignSelf: "center",
  backgroundColor: "rgba(0,0,0,0.5)",
  paddingHorizontal: 20,
  paddingVertical: 10,
  borderRadius: 30,
},

statusText: {
  fontSize: 30,
  fontWeight: "bold",
},
overlay: {
  ...StyleSheet.absoluteFillObject,
  justifyContent: "center",
  alignItems: "center",
},

ovalFrame: {
  width: 300,
  height: 450,
  borderRadius: 200,
  borderWidth: 5,
  borderColor: "white",
  backgroundColor: "transparent",
},
});
