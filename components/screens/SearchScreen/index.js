import React, { useEffect, useState } from 'react'
import { Text, View, TouchableOpacity, TextInput, FlatList, Keyboard, Modal, Alert, ImageBackground } from 'react-native';
import styles from './styles';
import { Ionicons, FontAwesome, Entypo } from '@expo/vector-icons';
import { Camera } from "expo-camera";
import { firebase } from '../../fbconfig/config';
import { useNavigation } from '@react-navigation/native';

export default function SearchScreen(props) {
    const navigation = useNavigation(); 
    const [entityText, setEntityText] = useState('')
    const [entities, setEntities] = useState([])

    const [ingrText, setIngrText] = useState('')


    const entityRef = firebase.firestore().collection('entities')
    const prevRef   = firebase.firestore().collection('previous')
    const ingrRef =   firebase.firestore().collection('ingrCount')
    const userID = props.extraData.id

    const [modalVisible, setModalVisible] = useState(false);
    const [ingrmodalVisible, setingrmodalVisible] = useState(false);

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

    // Camera Permission
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
        const options = { base64: true, doNotSave: true }
        let photo = await camera.takePictureAsync(options);
        // console.log(photo.base64)
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
        
      storageRef.child(userID + '.jpg').put(blob, {
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

    const submitIngredients = async() => {
      // Delete all previous
      await prevRef.get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          if (doc.data().authorID === userID) {
            prevRef.doc(doc.id).delete()
          }
        })
      })
      // Send ingredients found to previous so it can be displayed on the screen
      // Delete ingredients in entities
      await entityRef.get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            console.log(doc.data().authorID)
            if (doc.data().authorID === userID) {
                prevRef.add(doc.data())
                // entityRef.doc(doc.id).delete()
            }
        })
      })
      navigation.navigate('Recipe')
    }


    const ingrCount = async() => {
      // Delete all previous
      await ingrRef.get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          if (doc.data().authorID === userID) {
            ingrRef.doc(doc.id).delete()
          }
        })
      })

      if (ingrText && ingrText.length > 0) {
        const timestamp = firebase.firestore.FieldValue.serverTimestamp();
        const data = {
            text: ingrText,
            authorID: userID,
            createdAt: timestamp,
        };
        ingrRef
            .add(data)
            .then(_doc => {
                setEntityText('')
                Keyboard.dismiss()
            })
            .catch((error) => {
                alert(error)
            });
    }
      setModalVisible(!modalVisible)
      setingrmodalVisible(!ingrmodalVisible)
      uploadImage();  
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
    

    return (
    <>
    <View style={styles.container}>
      {ingrmodalVisible ? (
      <Modal
        animationType="fade"
        transparent={true}
        visible={ingrmodalVisible}
        onRequestClose={() => {
          setingrmodalVisible(!ingrmodalVisible);
      }}>
        <View style={styles.cameraContainer} >
        <ImageBackground // Image of background + Retake Image Text
          source={{ uri: capturedImage && capturedImage.uri }}
          style={styles.imageBGContainer} >
        <View style={styles.modalcontainer}>
          <View style={styles.ingrformContainer}>
              <TextInput
                  autoFocus={true}
                  keyboardType="number-pad"
                  style={styles.input}
                  placeholder='How many ingredients?'
                  placeholderTextColor="#aaaaaa"
                  onChangeText={(text) => setIngrText(text)}
                  value={ingrText}
                  underlineColorAndroid="transparent"
                  autoCapitalize="none"
              />
              <TouchableOpacity style={styles.button} onPress={ingrCount} >
              <Text style={styles.buttonText} onSubmitEditing={() => {ingrCount(item)}}>Add</Text>
              </TouchableOpacity>
          </View>
        </View>
        </ImageBackground>
        </View>
      </Modal>
      ) : (
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
                onPress={() => { setingrmodalVisible(!ingrmodalVisible) }}
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
      )}
      <View style={styles.loadIngredients}>
              <Entypo.Button name="camera" backgroundColor="#4CD4CB" onPress={() =>  setModalVisible(true)}>
                Take a Picture of Ingredients
              </Entypo.Button>
          </View>
        <View style={styles.formContainer}>
            <TextInput
                style={styles.input}
                placeholder='Add new ingredient'
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
              <View style={styles.loadIngredients}>
                <Ionicons.Button name="exit-outline" backgroundColor="#4CD4CB" onPress={() => submitIngredients()}>
                  Save Ingredients
                </Ionicons.Button>
              </View>
            </View>
    </View>
    </>    
  )    
}