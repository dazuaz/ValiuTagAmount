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
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  StatusBar,
  Button,
} from 'react-native';

import {Colors} from './components/Theme';
import ValiuLogo from './assets/logo_valiu.svg';
import TagsList from './components/TagList';
import useTagsService from './components/useTagsService';
import {removeTag} from './utils/TagsApi';

const App = () => {
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <View
            style={{
              paddingHorizontal: 24,
              alignSelf: 'flex-end',
            }}>
            <Text style={styles.headingText}>Amount Tags</Text>
          </View>
          <View
            style={{
              paddingHorizontal: 24,
            }}>
            <ValiuLogo width="106" height="40" />
          </View>
        </View>
        <View style={styles.body}>
          <TagListFromService />
        </View>
        <Button title="Create amount tag" onPress={() => {}} />
      </SafeAreaView>
    </>
  );
};

const TagListFromService = () => {
  const {state, dispatch} = useTagsService();
  const handleRemoveTag = async (id: string) => {
    dispatch({type: 'REMOVE_TAG', payload: id}); //remove on client
    await removeTag(id); //remove on server TODO: handle failure
  };
  return <TagsList tags={state.tags} handleRemoveTag={handleRemoveTag} />;
};

const styles = StyleSheet.create({
  safeArea: {flex: 1},
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingVertical: 12,
  },
  body: {
    paddingHorizontal: 24,
    flex: 1,
  },
  headingText: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
});
export default App;
