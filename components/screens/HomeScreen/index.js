import React, { useEffect, useState } from 'react';
import { Text, View, FlatList, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import styles from './styles';
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { Linking } from 'react-native';

import { firebase } from '../../fbconfig/config';

export default function HomeScreen(props) {
  const { navigation } = props;
  var axios = require("axios").default;

  const [recipes, setRecipes] = useState([]);
  const [isScrollEnabled, setIsScrollEnabled] = useState(true);

  const entityRef = firebase.firestore().collection('entities')
  const prevRef   = firebase.firestore().collection('previous')
  const userID = props.extraData.id

  useEffect(() => {
   getRecipe();
  }, []); 

  const getRecipe = async () => {
    const url = `https://api.edamam.com/search?q=chicken%2C%20rice%2C%20leeks&app_id=4183953e&app_key=7afed6902d0ef49e947a3a09ab0f4286`;
    const result = await axios.get(url);
    setRecipes(result.data.hits);
  }

  const renderRecipe = ({item, index}) => {
    let imageHttpUrl = {uri : item.recipe.image}

        return (
        <>
          <View style={styles.entityContainer} >
            <Text style={styles.entityText} blurOnSubmit={false} > {item.recipe.label} </Text>
              <Image
                style={styles.entityImage}
                source={imageHttpUrl}
                alt = {item.recipe.label}
                />
            <View style={styles.goToRecipe}>
              <Ionicons.Button name="exit-outline" backgroundColor="#4CD4CB" onPress={() => Linking.openURL(item.recipe.shareAs)}>
                Go To Recipe
              </Ionicons.Button>
            </View>
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
    navigation.navigate('Search')
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
    navigation.navigate('Search')
  }

  return (
    <>
      <View style={styles.container}>
          <StatusBar style="auto" />
          <View style={styles.homeButton}>
            <FontAwesome.Button name="search" backgroundColor="#4CD4CB" onPress={() => newSearch()}>
              Search for new Recipes
            </FontAwesome.Button>
          </View>
          <View style={styles.homeButton2}>
          <FontAwesome.Button name="search" backgroundColor="#4CD4CB" onPress={() => previousSearch()}>
              Return to Previous Recipe
            </FontAwesome.Button>
          </View>
        <View style={styles.flatlistContainer}>
            <Text style={styles.titleText}>Most Popular Recipes</Text>
            <View style={{ borderBottomColor: 'black', borderBottomWidth: 1, alignSelf: "stretch", }} />
          <View style={styles.flatliststyle}>
          <FlatList
            initialNumToRender={3}
            windowSize={3}
            maxToRenderPerBatch = {3}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            scrollEnabled={isScrollEnabled}
            data={recipes}
            renderItem={renderRecipe}
            keyExtractor={(item, index) => index}
            removeClippedSubviews={true}
          />
          </View>
        </View>
      </View>
    </>
  );
}