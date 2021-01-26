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
import {SafeAreaView, StatusBar, StyleSheet} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import NumpadScreen from './screens/NumpadScreen';
import {SocketService} from './utils/SocketService';

import {Provider, useDispatch} from 'react-redux';
import store from './store';
import {addTag, updateTag, removeTag} from './features/taglist/tagsSlice';
const Stack = createStackNavigator<RootStackParamList>();

const App: React.FC = () => (
  <Provider store={store}>
    <NavigationContainer>
      <StatusBar />
      <SocketSubscribe />
    </NavigationContainer>
  </Provider>
);

const SocketSubscribe: React.FC = () => {
  const dispatch = useDispatch();
  const service = React.useMemo(() => new SocketService(), []);
  React.useEffect(() => {
    service.init();
    const onAddSub = service.onAddTag().subscribe((t: Tag) => {
      dispatch(addTag(t));
    });
    const onModSub = service.onModifyTag().subscribe((t: Tag) => {
      dispatch(
        updateTag({
          id: t._id,
          changes: {title: t.title, updated_at: t.updated_at},
        }),
      );
    });
    const onRemSub = service.onRemoveTag().subscribe((id: string) => {
      dispatch(removeTag(id));
    });
    return () => {
      onAddSub.unsubscribe();
      onModSub.unsubscribe();
      onRemSub.unsubscribe();
      service.disconnect();
    };
  }, [service, dispatch]);

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Numpad" component={NumpadScreen} />
      </Stack.Navigator>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
export default App;
