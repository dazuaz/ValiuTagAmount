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
import {
  ActionTypes,
  TagListProvider,
  useTagListDispatch,
} from './components/TagListContext';
import {SocketService} from './utils/SocketService';
import {
  GlobalProvider,
  useGlobalDispatch,
  ActionTypes as GlobalTypes,
} from './components/GlobalContext';
const Stack = createStackNavigator<RootStackParamList>();

const App: React.FC = () => (
  <NavigationContainer>
    <StatusBar barStyle="dark-content" />
    <GlobalProvider>
      <TagListProvider>
        <SocketSubscribe />
      </TagListProvider>
    </GlobalProvider>
  </NavigationContainer>
);

const SocketSubscribe: React.FC = () => {
  const dispatch = useTagListDispatch();
  const gloablDispatch = useGlobalDispatch();
  const service = React.useMemo(() => new SocketService(), []);
  React.useEffect(() => {
    service.init();
    const onAddSub = service.onAddTag().subscribe((t: Tag) => {
      dispatch({type: ActionTypes.ADD_TAG_SAFE, payload: t});
      gloablDispatch({type: GlobalTypes.SET_REPlACED, payload: t._id});
    });
    const onModSub = service.onModifyTag().subscribe((t: Tag) => {
      dispatch({type: ActionTypes.MODIFY_TAG, payload: t});
      gloablDispatch({type: GlobalTypes.SET_REPlACED, payload: t._id});
    });
    const onRemSub = service.onRemoveTag().subscribe((id: string) => {
      dispatch({type: ActionTypes.REMOVE_TAG_BY_ID, payload: id});
    });
    return () => {
      onAddSub.unsubscribe();
      onModSub.unsubscribe();
      onRemSub.unsubscribe();
      service.disconnect();
    };
  }, [service, dispatch, gloablDispatch]);

  return (
    <SafeAreaView style={{flex: 1}}>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Numpad" component={NumpadScreen} />
      </Stack.Navigator>
    </SafeAreaView>
  );
};

export default App;
