import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, FlatList, Keyboard, Button, Modal, Pressable, Alert, ImageBackground, ActivityIndicator, Image, ScrollView } from 'react-native';
import axios from 'axios';
import { Linking } from 'react-native';
import { FontAwesome } from "@expo/vector-icons";
import { AntDesign } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

import styles from './styles'
import { firebase } from '../../fbconfig/config';
import { get } from 'react-native/Libraries/Utilities/PixelRatio';

import TimeRadioButton from './timeRadioButton';
import HealthRadioButton from './healthRadioButton'
import MealRadioButton from './mealRadioButton'


export default function RecipeScreen (props) {
  var axios = require("axios").default;

  const [recipes, setRecipes] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [showIngredients, setshowIngredients] = useState(false);
  const [queryString, setQueryString] = useState('');
  const [entities, setEntities] = useState([])
  const [ingr, setIngr] = useState([])

  const entityRef = firebase.firestore().collection('entities')
  const userID = props.extraData.id

  const [isTimeConstraint, setisTimeConstraint] = useState(false);
  const [isHealthConstraint, setisHealthConstraint] = useState(false);
  const [isMealConstraint, setisMealConstraint] = useState(false);

  const [timeselectedOption, settimeSelectedOption] = useState(null);
  const timeOptions = [
    {
        key: 'under30',
        text: 'Under 30 minutes',
    },
    {
        key: 'under60',
        text: 'Under 60 minutes',
    },
  ];
  const [healthselectedOption, sethealthSelectedOption] = useState(null);
  const healthOptions = [
    {
        key: 'vegetarian',
        text: 'Vegetarian',
    },
    {
        key: 'vegan',
        text: 'Vegan',
    },
    {
        key: 'paleo',
        text: 'Paleo',
    },
    {
        key: 'dairy-free',
        text: 'Dairy Free',
    },
    {
        key: 'gluten-free',
        text: 'Gluten Free',
    },
    {
        key: 'keto-friendly',
        text: 'Ketogenic',
    },
    {
        key: 'pescatarian',
        text: 'Pescatarian',
    },
    {
        key: 'egg-free',
        text: 'Egg Free',
    },
    {
        key: 'sugar-conscious',
        text: 'Sugar Conscious',
    }
  ];
  const [mealselectedOption, setmealSelectedOption] = useState(null);
  const mealOptions = [
    {
        key: 'Breakfast',
        text: 'Breakfast',
    },
    {
        key: 'Lunch',
        text: 'Lunch',
    },
    {
        key: 'Dinner',
        text: 'Dinner',
    }
  ];

  useEffect(() => {
    entityRef
    .where("authorID", "==", userID)
    .orderBy('createdAt', 'desc')
    .onSnapshot(querySnapshot => {
      const newingreds = []
      querySnapshot.forEach(doc => {     
        const ingreds = doc.data().text
        newingreds.push(ingreds)
        console.log("ingr: " + ingreds)
      });
      setIngr(newingreds)
      // getRecipes();      
    },error => {console.log(error)})

    // setTimeout(() => {
    //   getRecipes();
    // }, 5000)
  }, []); 

  function sleep(ms) {
    console.log("Sleeping for : " + ms )
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

  const getRecipes = async() => {
    console.log("In getRecipes()")
    // console.log("ingredients: " + ingr)
    const ingredientsArray = ingr;
    // console.log("arra: " + ingredientsArray)

    const queryarray = ingredientsArray.map((ingredientsArray) => 
      ingredientsArray + '%2C%20'
    )
    const querystring = queryarray.toString().split(','); // Split object by ,
    const querystringR = querystring.toString().replace(',', ''); // Remove ,
    const querystringE = querystringR.toString().slice(0, -6); // Remove last 6 (%2C%20) from array
    const querystringF = querystringE.toString().replace(',',''); // Remove ,
    const querystringG = querystringF.toString().replace(' ', ''); // Remove spaces

    let filter = ''

    console.log('E' + querystringG)

    if (timeselectedOption != null) {
      if (timeselectedOption.key === 'under30' ) {
        filter = filter + '&time=30'
      }
      if (timeselectedOption.key === 'under60' ) {
        filter = filter + '&time=60'
      }
    }
    if (healthselectedOption != null) {
      filter = filter + '&' + healthselectedOption.key
    }
    if (mealselectedOption != null) {
      filter = filter + '&' + mealselectedOption.key
    }

    const APP_ID = '4183953e';
    const APP_KEY = '7afed6902d0ef49e947a3a09ab0f4286';
    const url = `https://api.edamam.com/search?q=${querystringG}&app_id=${APP_ID}&app_key=${APP_KEY}${filter}`;

    console.log(url)
    const result = await axios.get(url);
    setRecipes(result.data.hits);
    setLoading(false);
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

  const ontimeSelect = (timeitem) => {
    if (timeselectedOption && timeselectedOption.key === timeitem.key) {
      settimeSelectedOption(null);
    } else {
      settimeSelectedOption(timeitem);
    }
  };

  const onhealthSelect = (healthitem) => {
    if (healthselectedOption && healthselectedOption.key === healthitem.key) {
      sethealthSelectedOption(null);
    } else {
      sethealthSelectedOption(healthitem);
    }
  };

  const onmealSelect = (mealitem) => {
    if ( mealselectedOption && mealselectedOption.key === mealitem.key) {
      setmealSelectedOption(null);
    } else {
      setmealSelectedOption(mealitem);
    }
  };

  const onSubmit = () => {
    console.log(timeselectedOption.key);
    console.log(healthselectedOption.key);
    console.log(mealselectedOption.key);
  }

  return (
    <>
    <View style={{ flex: 1, padding: 24 }}>
    {isLoading ? 
    <>
      <View style={styles.radioButtonContainer}>
        <ScrollView>
          <TouchableOpacity
            onPress={() => setisTimeConstraint(!isTimeConstraint)}
          ><Text>Time Restraints</Text></TouchableOpacity>
          {isTimeConstraint ? <>
            <TimeRadioButton
            selectedOption={timeselectedOption}
            onSelect={ontimeSelect}
            options={timeOptions}
          />
          </>
          
        : (<></>)}
        <TouchableOpacity
          onPress={() => setisHealthConstraint(!isHealthConstraint)}
        ><Text>Health Options</Text></TouchableOpacity>
        {isHealthConstraint ? <>
          <HealthRadioButton
            selectedOption={healthselectedOption}
            onSelect={onhealthSelect}
            options={healthOptions}
          />
        </> : (<></>)}
        <TouchableOpacity
          onPress={() => setisMealConstraint(!isMealConstraint)}
        ><Text>Meal Type</Text>
        </TouchableOpacity>
        {isMealConstraint ? <>
          <MealRadioButton
            selectedOption={mealselectedOption}
            onSelect={onmealSelect}
            options={mealOptions}
          />
          
        </> : (<></>)}
      </ScrollView>
        <Button title="SUBMIT" onPress={onSubmit} />
        <Button
          onPress={() => getRecipes()}
          color="black"
          title="Load Recipes"        
        >
        </Button>
        
      </View></> : (
      <FlatList
        // horizontal
        data={recipes}
        renderItem={renderRecipe}
        keyExtractor={item => item.id}
        removeClippedSubviews={true}
      />
    )}
  </View>
  
  </>
  );
};