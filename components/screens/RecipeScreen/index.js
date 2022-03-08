import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import axios from 'axios';


export default function RecipeScreen ({navigation}) {
  var axios = require("axios").default;

  const [recipes, setRecipes] = useState([]);
  const [isLoading, setLoading] = useState(true);

  const appID = '4183953e';
  const appKey = '7afed6902d0ef49e947a3a09ab0f4286';
  const ingredients = ['pizza'];

  // const url = 'https://api.edamam.com/search?q=${ingredients}&app_id=${appID}&app_key=${appKey}';
  // const url = 'https://api.edamam.com/api/recipes/v2?type=public&q=${ingredients}&app_id=${appID}&app_key=${appKey}'
  const url = 'https://api.edamam.com/api/recipes/v2?type=public&q=${ingredients}&app_id=4183953e&app_key=7afed6902d0ef49e947a3a09ab0f4286'

  // const getRecipes = async() => {
  //   const result = await axios.get(url, {
  //     'Cache-Control': 'no-cache'
  //   });
  //   setRecipes(result.data.hits);

  //   console.log(result.data.hits);
  //   setLoading(false);
  // }

  const getRecipes = async() => {
    const result = await fetch('https://api.edamam.com/api/recipes/v2?type=public&q=${ingredients}&app_id=4183953e&app_key=7afed6902d0ef49e947a3a09ab0f4286',
    {
      method: 'GET',
      'Cache-Control': 'no-cache'
    });
    const jResult = await result.json();
    setRecipes(jResult.hits);
    console.log(jResult.hits);
    setLoading(false);
  }

  useEffect(() => {
    getRecipes();
  }, []);
  
  return (
    <>
    {/* <View style={{ flex: 1, padding: 24 }}>
        <TouchableOpacity onPress={() => getRecipes()} >
          <Text>click me please</Text>
        </TouchableOpacity>
    </View> */}
    <View style={{ flex: 1, padding: 24 }}>
    {isLoading ? <ActivityIndicator/> : (
      <FlatList
        data={recipes}
        keyExtractor={({ id }, index) => id}
        renderItem={({ item }) => (
          <Text>{item.recipe.label}</Text>
        )}
      />
    )}
  </View>
  </>
  );
};