import React, { useState, useEffect, useRef } from "react";
import { View, TouchableOpacity, Text, Alert } from "react-native";
import { Camera } from "expo-camera";
import * as ImagePicker from "expo-image-picker";

const CameraScreen = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraType, setCameraType] = useState(Camera.Constants.Type.back);
  const cameraRef = useRef(null);

  useEffect(() => {
    (async () => {
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      const imagePickerStatus =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      setHasPermission(
        cameraStatus.status === "granted" &&
          imagePickerStatus.status === "granted"
      );
    })();
  }, []);

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  const toggleCameraType = () => {
    setCameraType(
      cameraType === Camera.Constants.Type.back
        ? Camera.Constants.Type.front
        : Camera.Constants.Type.back
    );
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      const options = { quality: 0.5, base64: true };
      const data = await cameraRef.current.takePictureAsync(options);
      Alert.alert("Photo taken!", data.uri);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.cancelled) {
      Alert.alert("Photo picked!", result.uri);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Camera style={{ flex: 1 }} type={cameraType} ref={cameraRef}>
        <View
          style={{
            flex: 1,
            backgroundColor: "transparent",
            flexDirection: "row",
            justifyContent: "center",
            margin: 20,
          }}
        >
          <TouchableOpacity
            onPress={takePicture}
            style={{
              alignSelf: "flex-end",
              alignItems: "center",
              backgroundColor: "white",
              margin: 20,
              padding: 10,
              borderRadius: 5,
            }}
          >
            <Text style={{ fontSize: 14 }}>SNAP</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={toggleCameraType}
            style={{
              alignSelf: "flex-end",
              alignItems: "center",
              backgroundColor: "white",
              margin: 20,
              padding: 10,
              borderRadius: 5,
            }}
          >
            <Text style={{ fontSize: 14 }}>FLIP</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={pickImage}
            style={{
              alignSelf: "flex-end",
              alignItems: "center",
              backgroundColor: "white",
              margin: 20,
              padding: 10,
              borderRadius: 5,
            }}
          >
            <Text style={{ fontSize: 14 }}>UPLOAD</Text>
          </TouchableOpacity>
        </View>
      </Camera>
    </View>
  );
};

export default CameraScreen;
