import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, TextInput, FlatList, Keyboard, Button, Modal, Pressable, Alert, ImageBackground } from 'react-native';
import styles from './styles';
import { FontAwesome } from "@expo/vector-icons";
import { AntDesign } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { Camera } from "expo-camera";

import { firebase } from '../../fbconfig/config';

import { useNavigation } from '@react-navigation/native';

export default function SearchScreen(props) {
    const navigation = useNavigation(); 
    const [entityText, setEntityText] = useState('')
    const [entities, setEntities] = useState([])

    const entityRef = firebase.firestore().collection('entities')
    const userID = props.extraData.id

    const [modalVisible, setModalVisible] = useState(false);

    // Camera
    const [hasPermission, setHasPermission] = useState(null);
    const [previewVisible, setPreviewVisible] = useState(false);
    const [capturedImage, setCapturedImage] = useState(null);
    let camera = Camera;

    useEffect(() => {
        entityRef
            .where("authorID", "==", userID)
            .orderBy('createdAt', 'desc')
            .onSnapshot(
                querySnapshot => {
                    const newEntities = []
                    querySnapshot.forEach(doc => {
                        const entity = doc.data()
                        entity.id = doc.id
                        newEntities.push(entity)
                    });
                    setEntities(newEntities)
                },
                error => {
                    console.log(error)
                }
            )
        
    }, [])

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
        console.log('image is meant to be sent')
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

    const onAddButtonPress = () => {
        if (entityText && entityText.length > 0) {
            const timestamp = firebase.firestore.FieldValue.serverTimestamp();
            const data = {
                text: entityText,
                authorID: userID,
                createdAt: timestamp,
            };
            entityRef
                .add(data)
                .then(_doc => {
                    setEntityText('')
                    Keyboard.dismiss()
                })
                .catch((error) => {
                    alert(error)
                });
        }
    }

    const onDeleteButtonPress = (entity) => {
        entityRef
          .doc(entity.id)
          .delete()
          .then(() => {
            // alert("Ingredient Deleted")
          })
          .catch(error => {
            alert(error);
          })
    }

    const renderEntity = ({item, index}) => {
        return (
        <View style={styles.entityContainer} >
        <TextInput style={styles.entityText}
            onChangeText={(text) => setEntityText(text)}
            onSubmitEditing={() => {onAddButtonPress(item); onDeleteButtonPress(item)}}
            blurOnSubmit={false}
          >
           {item.text}   
        </TextInput>
        <View style={styles.textIcons}>
            <FontAwesome name="trash-o" color="red" onPress={() => onDeleteButtonPress(item)} style={styles.todoIcon} />
           </View>
        </View>
        )
    }
    const submitIngredients = () => {
      navigation.navigate('recipe')
    }

    return (
    <>
    <View style={styles.container}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setModalVisible(!modalVisible);
        }}
      >
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
                onPress={() => { uploadImage(); setModalVisible(!modalVisible) }}
                // onPress={uploadImage}
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
            <View style={styles.cameraCloseContainerButton}>
              <TouchableOpacity
                onPress={() => { setModalVisible(!modalVisible) }}
              >
                <Text style={styles.imageRetakeText}>Close Camera</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Camera>
      )}
    </View>
      </Modal>
      <Pressable
        style={[styles.buttonContainer, styles.buttonText]}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.textStyle}>Show Modal</Text>
      </Pressable>
        <View style={styles.formContainer}>
            <TextInput
                style={styles.input}
                placeholder='Add new entity'
                placeholderTextColor="#aaaaaa"
                onChangeText={(text) => setEntityText(text)}
                value={entityText}
                underlineColorAndroid="transparent"
                autoCapitalize="none"
            />
            <TouchableOpacity style={styles.button} onPress={onAddButtonPress} >
            <Text style={styles.buttonText} onSubmitEditing={() => {onAddButtonPress(item)}}>Add</Text>
            </TouchableOpacity>
        </View>
        { entities && (
            <View style={styles.listContainer}>
                <FlatList
                data={entities}
                renderItem={renderEntity}
                keyExtractor={(item) => item.id}
                removeClippedSubviews={true}
                />
            </View>
            )}
            <View style={styles.submitIngredients}>
                <Button 
                onPress={submitIngredients}
                color="black"
                title="Save Ingredients.."        
                >
                </Button>
            </View>
    </View>
        </>    
  )    
}