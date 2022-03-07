import React, { useEffect, useState } from 'react';
import { FlatList, Keyboard, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import styles from './styles';

import { firebase } from '../../fbconfig/config';

export default function RecipeScreen({navigation}) {
        return (
          <View style={styles.container}>
            <Text>this is the recipe page</Text>
            <StatusBar style="auto" />
    
            <TouchableOpacity
            style={styles.buttonContainer}
            onPress={() => navigation.navigate('home')}
            >
                <Text style={styles.buttonText}>to search</Text>
            </TouchableOpacity>
          </View>
        )
    }