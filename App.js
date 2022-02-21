import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, FlatList, Keyboard } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import styles from './components/styles/styles';
import { FontAwesome } from "@expo/vector-icons";
import { AntDesign } from '@expo/vector-icons';

import { firebase } from './components/fbconfig/config'

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

    const onTextEdit = (entity) => {
      alert('onTextEdit called')
      //if (entityText && entityText.length > 0) {
        const timestamp = firebase.firestore.FieldValue.serverTimestamp();
      // alert('update called');
        entityRef
          .doc(entity.id)
          .set({
            text: item,
            createdAt: timestamp
          })
          .then(() => {
            alert('Ingredient Updated')
          })
          .catch(error => {
            alert(error);
          })
      //}
    }


    const renderEntity = ({item}) => {
      return (
        <View 
          style={styles.entityContainer}
        >
          <TextInput style={styles.entityText}
            //onChangeText={}
            //value={item.text}
            onChangeText={(text) => setEntityText(text)}
            onSubmitEditing={() => {onAddButtonPress(item); onDeleteButtonPress(item)}}
          >
           {item.text}   
          </TextInput>
          <View style={styles.textIcons}>
            <FontAwesome name="trash-o" color="red" onPress={() => onDeleteButtonPress(item)} style={styles.todoIcon} />
            <AntDesign name="edit" color="black" onPress={() => { onAddButtonPress; onDeleteButtonPress(item)}} style={styles.todoIcon} />
           </View>
        </View>
      )
  }


    return (
      <>
      <View style={styles.container}>
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
          <TouchableOpacity style={styles.button} onPress={onAddButtonPress}>
            <Text style={styles.buttonText}>Add</Text>
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
