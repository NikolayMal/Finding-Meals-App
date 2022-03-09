
import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { HomeScreen, LoginScreen, RegistrationScreen, SearchScreen, RecipeScreen } from './components/screens/index'
import {decode, encode} from 'base-64'
if (!global.btoa) {  global.btoa = encode }
if (!global.atob) { global.atob = decode }

// Issue with Async warning tied to Firebase & Expo : 
// https://github.com/firebase/firebase-js-sdk/issues/1847

import { firebase } from './components/fbconfig/config';

const Stack = createStackNavigator();

export default function App() {

  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)

  // if (loading) {	
  //   return (	
  //     <></>	
  //   )	
  // }

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
      <Stack.Navigator>
        { user ? (
          <>
          <Stack.Screen name="home">
            {props => <HomeScreen {...props} extraData={user} />}
          </Stack.Screen>
          <Stack.Screen name="search">
            {props => <SearchScreen {...props} extraData={user} />}
          </Stack.Screen>
          <Stack.Screen name="recipe">
            {props => <RecipeScreen {...props} extraData={user} />}
          </Stack.Screen>
          </>
        ) : (
          <>
            <Stack.Screen name="login" component={LoginScreen} />
            <Stack.Screen name="registration" component={RegistrationScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}