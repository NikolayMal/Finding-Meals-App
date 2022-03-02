import * as firebase from 'firebase';
import '@firebase/auth';
import '@firebase/firestore';
import '@firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyDxUUGU1WjXHAqhM00AUJG_zDKyqcZPpEs",
    authDomain: "findingmeals-3c3ae.firebaseapp.com",
    projectId: "findingmeals-3c3ae",
    storageBucket: "findingmeals-3c3ae.appspot.com",
    messagingSenderId: "821557371874",
    appId: "1:821557371874:web:2eaa5e30838ce73d6b0fbb",
    measurementId: "G-SDLBXRC0ZQ"
  };

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig); 
}

export { firebase };

// https://console.firebase.google.com/u/3/project/findingmeals-3c3ae/overview