import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, FlatList, Keyboard, Button, ImageBackground } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import styles from './styles';
import { FontAwesome } from "@expo/vector-icons";
import { AntDesign } from '@expo/vector-icons';
import { Camera } from "expo-camera";

import { firebase } from '../../fbconfig/config';

export default function CameraScreen({navigation}) { 
    const [hasPermission, setHasPermission] = useState(null);
    const [previewVisible, setPreviewVisible] = useState(false);
    const [capturedImage, setCapturedImage] = useState(null);
    const [image, setImage] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [transferred, setTransferred] = useState(0);
    let camera = Camera;

    useEffect(() => {
        (async () => {
        const { status } = await Camera.requestCameraPermissionsAsync();
        setHasPermission(status === "granted");
        })();
    }, []);

    if (hasPermission === null) {
        return <View />;
    }

    if (hasPermission === false) {
        return <Text>No access to camera</Text>;
    }

    const takePicture = async () => {
        if (!camera) return;
        let photo = await camera.takePictureAsync();
        setPreviewVisible(true);
        setCapturedImage(photo);
    };

    async function uploadImage() {
        const storage = firebase.storage();
        const uri = capturedImage.uri
        const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
        resolve(xhr.response);
        };
        xhr.onerror = function (e) {
        console.log(e);
        reject(new TypeError("Network request failed"));
        };
        xhr.responseType = "blob";
        xhr.open("GET", uri, true);
        xhr.send(null);
        })

        const storageRef = firebase.storage().ref();
        
        storageRef.child('photo.jpg').put(blob, {
        contentType: 'image/jpeg'
        }).then((snapshot)=>{
        blob.close();
        })
    }

  return (
    <View style={styles.cameraContainer} >
      {previewVisible ? (
        <ImageBackground // Image of background + Retake Image Text
          source={{ uri: capturedImage && capturedImage.uri }}
          style={styles.imageBGContainer} >
          <View style={styles.cameraContentContainer} >
            <View style={styles.imageReTakenContainer} >
              <TouchableOpacity
                onPress={() => setPreviewVisible(false)}
                style={styles.imageReTakePicture} >
                <Text style={styles.imageRetakeText} > Re-take </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={uploadImage}
                style={styles.imageReTakePicture} >
                <Text style={styles.imageRetakeText} > Send Image </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>
      ) : (
        <Camera
          style={{ flex: 1 }}
          ref={(r) => {
            camera = r;
          }}> 
          <View style={styles.cameraShowContainer} > 
            <View style={styles.takePictureContainer} >
              <View style={ styles.takePictureContent } >
                <TouchableOpacity onPress={takePicture} style={styles.takePictureButton } />
              </View>
            </View>
          </View>
        </Camera>
      )}
    </View>
  )
}