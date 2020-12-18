/**
 * React Native App for Job Application @valiu
 * @see https://www.notion.so/Test-for-Senior-React-Native-developer-1679db9b7aec42c0af613227b3ca0e98
 *
 * Based on Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React from 'react';
import {SafeAreaView, StatusBar} from 'react-native';

import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import NumpadScreen from './screens/NumpadScreen';
import {RootStackParamList} from './types';

const Stack = createStackNavigator<RootStackParamList>();

const App = () => {
  // Only used for demo, should be replaced by react-navigation or similar

  return (
    <NavigationContainer>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={{flex: 1}}>
        <Stack.Navigator screenOptions={{headerShown: false}}>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Numpad" component={NumpadScreen} />
        </Stack.Navigator>
      </SafeAreaView>
    </NavigationContainer>
  );
};

export default App;
