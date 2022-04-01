import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, FlatList, Keyboard, Button, Modal, Pressable, Alert, ImageBackground, ActivityIndicator, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import styles from './styles';

import axios from 'axios';

import { firebase } from '../../fbconfig/config';

export default function HomeScreen(props) {
  const { navigation } = props;
  var axios = require("axios").default;

  const [recipes, setRecipes] = useState([]);
  const [entities, setEntities] = useState([])
  const [ingr, setIngr] = useState([])
  const [isScrollEnabled, setIsScrollEnabled] = useState(false);

  const entityRef = firebase.firestore().collection('entities')
  const prevRef   = firebase.firestore().collection('previous')
  const userID = props.extraData.id

  let count = 0

  useEffect(() => {
   getRecipe();
  }, []); 

  const getRecipe = async () => {
    const url = `https://api.edamam.com/search?q=beef%2C%20potato%2C%20leeks&app_id=4183953e&app_key=7afed6902d0ef49e947a3a09ab0f4286&ingr=5`;
    const result = await axios.get(url);
    setRecipes(result.data.hits);
    
  }

  const renderRecipe = ({item, index}) => {
    let imageHttpUrl = {uri : item.recipe.image}

      return (
      <>
        <View style={styles.entityContainer} >
        <Text style={styles.entityText} blurOnSubmit={false} >
          {item.recipe.label}   
        </Text>
        <Image
          style={{width: 50, height: 50}}
          source={imageHttpUrl}
          alt = {item.recipe.label}
          />
        <Text 
          style={{color: 'blue'}}  
          onPress={() => Linking.openURL(item.recipe.shareAs)} // also can use item.recipe.url
        >
          go to recipe...
      </Text>
      </View>
      </>
      )
  }

  const previousSearch = async() => {
    // Clear entities just incase there are any
    await entityRef.get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        if (doc.data().authorID === userID) {
          entityRef.doc(doc.id).delete()
        }
      })
    })
    // Add all ingredients previous
    await prevRef.get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
          if (doc.data().authorID === userID) {
              entityRef.add(doc.data())
              // entityRef.doc(doc.id).delete()
          }
      })
    })
    navigation.navigate('search')
  }

  const newSearch = async() => {
    // Delete all existing
    await entityRef.get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        if (doc.data().authorID === userID) {
          entityRef.doc(doc.id).delete()
        }
      })
    })
    navigation.navigate('search')
  }

  return (
    <>
      <View style={styles.container}>
          <StatusBar style="auto" />

          <TouchableOpacity
          style={styles.buttonContainer}
          onPress={() => newSearch()}
          >
              <Text style={styles.buttonText}>to search</Text>
          </TouchableOpacity>
        <View style={styles.flatliststyle}>
          <Text>Most Popular Search</Text>
          <FlatList
            // horizontal
            // Scrollable no
            scrollEnabled={isScrollEnabled}
            data={recipes}
            renderItem={renderRecipe}
            keyExtractor={(item) => item.id}
            removeClippedSubviews={true}
          />
        </View>
        <View style={styles.previousTextContainer}>
          <TouchableOpacity 
            style={styles.previousText}
            onPress={() => previousSearch()}
          >
            <Text>Previous Search
              </Text>
            </TouchableOpacity>
        </View>
      </View>
    </>
  );
}