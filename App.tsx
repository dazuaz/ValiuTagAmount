/**
 * React Native App for a coding exercise.
 *
 * Based on Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import * as React from 'react';
import {SafeAreaView, StatusBar} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import NumpadScreen from './screens/NumpadScreen';
import {TagListProvider} from './components/TagListContext';
const Stack = createStackNavigator<RootStackParamList>();

const App: React.FC = () => (
  <NavigationContainer>
    <StatusBar barStyle="dark-content" />
    <TagListProvider>
      <SafeAreaView style={{flex: 1}}>
        <Stack.Navigator screenOptions={{headerShown: false}}>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Numpad" component={NumpadScreen} />
        </Stack.Navigator>
      </SafeAreaView>
    </TagListProvider>
  </NavigationContainer>
);

export default App;
