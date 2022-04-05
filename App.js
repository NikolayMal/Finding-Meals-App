
import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { HomeScreen, LoginScreen, RegistrationScreen, SearchScreen, RecipeScreen } from './components/screens/index'
import {decode, encode} from 'base-64'
if (!global.btoa) {  global.btoa = encode }
if (!global.atob) { global.atob = decode }


import styles from './components/screens/SearchScreen/styles';
// Issue with Async warning tied to Firebase & Expo : 
// https://github.com/firebase/firebase-js-sdk/issues/1847

import { firebase } from './components/fbconfig/config';
import { Button } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage"
import {Restart} from 'fiction-expo-restart';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Entypo } from "@expo/vector-icons";

const Stack = createStackNavigator();

export default function App() {

  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)

  // if (loading) {	
  //   return (	
  //     <></>	
  //   )	
  // }

  async function  logOut(){
    const asyncStorageKeys = await AsyncStorage.getAllKeys();
    if (asyncStorageKeys.length > 0) {
        if (Platform.OS === 'android') {
            await AsyncStorage.clear();
        }
        if (Platform.OS === 'ios') {
            await AsyncStorage.multiRemove(asyncStorageKeys);
        }
        
    }
    Restart();
    console.log(' cleaning of async storage Done.');

    }

  useEffect(() => {
    const usersRef = firebase.firestore().collection('users');
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        usersRef
          .doc(user.uid)
          .get()
          .then((document) => {
            const userData = document.data()
            setLoading(false)
            setUser(userData)
          })
          .catch((error) => {
            setLoading(false)
          });
      } else {
        setLoading(false)
      }
    });
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: '#4CD4CB' },
          headerRight: () => (
              <Entypo name="log-out" color="red" onPress={() => logOut()} style={styles.todoIcon} />
          )
      }}>
        { user ? (
          <>
          <Stack.Screen name="Home">
            {props => <HomeScreen {...props} extraData={user} />}
          </Stack.Screen>
          <Stack.Screen name="Search">
            {props => <SearchScreen {...props} extraData={user} />}
          </Stack.Screen>
          <Stack.Screen name="Recipe">
            {props => <RecipeScreen {...props} extraData={user} />}
          </Stack.Screen>
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Registration" component={RegistrationScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}