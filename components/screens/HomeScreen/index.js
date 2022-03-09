import React, { useEffect, useState } from 'react';
import { FlatList, Keyboard, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import styles from './styles';

import { firebase } from '../../fbconfig/config';

export default function HomeScreen({navigation}) {
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