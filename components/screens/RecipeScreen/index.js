import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, FlatList, Keyboard, Button, Modal, Pressable, Alert, ImageBackground, ActivityIndicator, Image } from 'react-native';
import axios from 'axios';
import { Linking } from 'react-native';
import { FontAwesome } from "@expo/vector-icons";
import { AntDesign } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import styles from './styles'

export default function RecipeScreen ({navigation}) {
  var axios = require("axios").default;

  const [recipes, setRecipes] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [showIngredients, setshowIngredients] = useState(false);

  const APP_ID = '4183953e';
  const APP_KEY = '7afed6902d0ef49e947a3a09ab0f4286';
  const ingredientsArray = ['pizza', 'egg'];
  const query = ['pizza%2C%20egg'];
  const url = `https://api.edamam.com/search?q=${query}&app_id=${APP_ID}&app_key=${APP_KEY}`;

  const getRecipes = async() => {
    const result = await axios.get(url);
    setRecipes(result.data.hits);
   //console.log(result.data.hits);
    setLoading(false);
  }

  useEffect(() => {
    getRecipes();
  }, []);

  // const ingredientsString = () => {
  //   const querystring = ingredientsArray.map((ingredientsArray) => 
  //     ingredientsArray + '1'
  //   )
  //   console.log(ingredientsArray)
  // }

  const renderRecipe = ({item, index}) => {
    let imageHttpUrl = {uri : item.recipe.image}
    return (
    <>
      <View style={styles.entityContainer} >
      <TextInput style={styles.entityText} blurOnSubmit={false} >
        {item.recipe.label}   
        {/* {item.recipe.food} */}
      </TextInput>
      <Image
        style={{width: 50, height: 50}}
        // source={require('../../../assets/favicon.png')}
        source={imageHttpUrl}
        alt = {item.recipe.label}
        />
      <Text 
      style={{color: 'blue'}}  
      onPress={() => Linking.openURL('http://google.com')}
      >
        go to recipe...
     </Text>
     <Button onPress = {() => setshowIngredients(!showIngredients)} title="Show Ingredients"/>

     {showIngredients && 
     <Text style={{ color: 'red' }}>{item.recipe.ingredientLines}</Text>
     }

          
      
     </View>
    </>
    )
  }

  return (
    <>
    <View style={{ flex: 1, padding: 24 }}>
    {isLoading ? <ActivityIndicator/> : (
      <FlatList
        data={recipes}
        renderItem={renderRecipe}
        keyExtractor={(item) => item.id}
        removeClippedSubviews={true}
      />
    )}
  </View>
  </>
  );
};