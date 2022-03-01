import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, FlatList, Keyboard, Button, ImageBackground } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import styles from './components/styles/styles';
import { FontAwesome } from "@expo/vector-icons";
import { AntDesign } from '@expo/vector-icons';
import { Camera } from "expo-camera";

import { firebase } from './components/fbconfig/config';
// import storage from '@react-native-firebase/storage';

function HomeScreen({navigation}) {

    return (
      <View style={styles.container}>
        <Text>this is the home page</Text>
        <StatusBar style="auto" />

        <TouchableOpacity
        style={styles.buttonContainer}
        onPress={() => navigation.navigate('Search')}
        >
            <Text style={styles.buttonText}>to search</Text>
        </TouchableOpacity>
      </View>
    )
}

function CameraScreen({navigation}) {
  const [hasPermission, setHasPermission] = useState(null);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);

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

  const uploadImage = async () => {
    const { uri } = capturedImage;
    const filename = uri.substring(uri.lastIndexOf('/') + 1);
    const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
    setUploading(true);
    setTransferred(0);
    const task = storage()
      .ref(filename)
      .putFile(uploadUri);
    // set progress state
    task.on('state_changed', snapshot => {
      setTransferred(
        Math.round(snapshot.bytesTransferred / snapshot.totalBytes) * 10000
      );
    });
    try {
      await task;
    } catch (e) {
      console.error(e);
    }
    setUploading(false);
    Alert.alert(
      'Photo uploaded!',
      'Your photo has been uploaded to Firebase Cloud Storage!'
    );
    setImage(null);
  };

    // const uploadImage = async () => {
    //   // const { uri } = image; 
    //   const timestamp = firebase.firestore.FieldValue.serverTimestamp();
    //   const data = {
    //     image: 
    //     createdAt: timestamp
    //   }  
    

    // }

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
                onPress={() => uploadImage}
                style={styles.imageReTakePicture} >
                <Text style={styles.imageRetakeText} > Send Image </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>
      ) : (
        <Camera
          style={{ flex: 1 }}
          type={type}
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

function SearchScreen({navigation}) {

  const [entityText, setEntityText] = useState('')
  const [entities, setEntities] = useState([])

  const entityRef = firebase.firestore().collection('SearchBar')

  useEffect(() => {
    entityRef
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

  

  const onAddButtonPress = async () => {
    if (entityText && entityText.length > 0) {
      const timestamp = firebase.firestore.FieldValue.serverTimestamp();
        const data = {
            text: entityText,
            createdAt: timestamp
        };
        entityRef
            .add(data)
            .then(() => {
                setEntityText('');
                Keyboard.dismiss();
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

    const renderEntity = ({item}) => {
      return (
        <View 
          style={styles.entityContainer}
        >
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
      alert("Searching for Recipes")
    }

    return (
      <>
      <View style={styles.container}>
      <View style={styles.toCameraScreen}>
        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={() => navigation.navigate('Camera')}
        >
          <Text style={styles.buttonText}>camera</Text>
        </TouchableOpacity>
        </View>
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
            <TextInput style={styles.buttonText} onSubmitEditing={() => {onAddButtonPress(item)}}>Add</TextInput>
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
            title="Search Recipes.."        
          >
            <Text> Searching Recipes </Text>
          </Button>
        </View>

      </View>
  </>    
);
}

const Stack = createStackNavigator();

function NavigationStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Home"
                component={HomeScreen} />
            <Stack.Screen 
                name="Search"
                component={SearchScreen} />
            <Stack.Screen 
                name="Camera"
                component={CameraScreen} />
        </Stack.Navigator>
    );
}

export default function App() {
    return (
        <NavigationContainer>
            <NavigationStack />
        </NavigationContainer>
    );
}

// Differentiate Each individual user so when adding to db its seperate for each user / device
// when the list is empty ( ie. opening search page ) display button which wants user to user camera
// Add recipes page
// Fill recipes page
// Add the cloud function