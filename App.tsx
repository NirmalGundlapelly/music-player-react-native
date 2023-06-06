import { Text, View } from 'react-native'
import React, { Component } from 'react'

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Home from './screens/Home'
import SongScreen from './screens/SongScreen';
import TestComponent from './screens/TestComponent';
import Actual from './screens/Actual';
import ActualHome from './screens/Actual';


const Stack = createNativeStackNavigator();
export default class App extends Component {
  render() {
    return (
    <ActualHome/>
      // <TestComponent/>
    //  <NavigationContainer>
    //   <Stack.Navigator screenOptions={{headerShown:false}}>
    //     <Stack.Screen name="Home" component={Home} />
    //     <Stack.Screen name="SongScreen" component={SongScreen} />
    //   </Stack.Navigator>
    // </NavigationContainer>
    )
  }
}