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
  const [queryString, setQueryString] = useState('');

  const APP_ID = '4183953e';
  const APP_KEY = '7afed6902d0ef49e947a3a09ab0f4286';
  const ingredientsArray = ['rice', 'chicken']; // String that ends up in queryString
  const url = `https://api.edamam.com/search?q=${queryString}&app_id=${APP_ID}&app_key=${APP_KEY}`;

  const getRecipes = async() => {
    const result = await axios.get(url);
    setRecipes(result.data.hits);
    // console.log(result.data.hits);
    setLoading(false);
  }

  useEffect(() => {
    getRecipes();
    ingredientsString();
  }, []);

  const ingredientsString = () => {
    const queryarray = ingredientsArray.map((ingredientsArray) => 
      ingredientsArray + '%2C%20'
    )
    const querystring = queryarray.toString().split(','); // Split object by ,
    const querystringR = querystring.toString().replace(',', ''); // Remove ,
    const querystringE = querystringR.toString().slice(0, -6); // Remove last 6 (%2C%20) from array
    setQueryString(querystringE);
  }

  const renderRecipe = ({item, index}) => {
    let imageHttpUrl = {uri : item.recipe.image}
    return (
    <>
      <View style={styles.entityContainer} >
      <TextInput style={styles.entityText} blurOnSubmit={false} >
        {item.recipe.label}   
      </TextInput>
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