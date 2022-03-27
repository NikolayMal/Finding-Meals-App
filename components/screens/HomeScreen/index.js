import React, { useEffect, useState } from 'react';
import { FlatList, Keyboard, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import styles from './styles';

// import * as mobilenet from '@tensorflow-models/mobilenet';
// import { fetch, decodeJpeg } from '@tensorflow/tfjs-react-native';


import { firebase } from '../../fbconfig/config';

export default function HomeScreen({navigation}) {
  // const [pred, setPred] = useState([])

  // const tens = async() => {
  //   const model = await mobilenet.load();

  //   // Get a reference to the bundled asset and convert it to a tensor
  //   const image = require('../../../assets/splash.png');
  //   const imageAssetPath = Image.resolveAssetSource(image);
  //   const response = await fetch(imageAssetPath.uri, {}, { isBinary: true });
  //   const imageData = await response.arrayBuffer();

  //   const imageTensor = decodeJpeg(imageData);

  //   const prediction = await model.classify(imageTensor);
  //   setPred(prediction)

  // }

  // useEffect(() => {
  //   tens();
  // })
        return (
          <View style={styles.container}>
            <Text>this is the home page</Text>
            <StatusBar style="auto" />
    
            <TouchableOpacity
            style={styles.buttonContainer}
            onPress={() => navigation.navigate('search')}
            >
                <Text style={styles.buttonText}>to search</Text>
            </TouchableOpacity>
            <TouchableOpacity
            style={styles.buttonContainer}
            onPress={() =>navigation.navigate('recipe')}
            >
                <Text style={styles.buttonText}>to recipe</Text>
            </TouchableOpacity>
          </View>
        )
    }