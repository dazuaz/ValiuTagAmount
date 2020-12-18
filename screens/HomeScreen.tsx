import React, {useRef} from 'react';
import {Animated, StyleSheet, Text, View} from 'react-native';
import {TagListFromService} from '../components/TagListFromService';
import {StackNavigationProp} from '@react-navigation/stack';

import {
  Colors,
  ValiuLogo,
  ButtonPrimary,
  HEADER_HEIGHT,
} from '../components/Theme';
import {RootStackParamList} from '../types';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

type HomeScreenProps = {
  navigation: HomeScreenNavigationProp;
};

const HomeScreen: React.FC<HomeScreenProps> = ({navigation}) => {
  const offset = useRef(new Animated.Value(0)).current;

  const headerHeight = offset.interpolate({
    inputRange: [0, HEADER_HEIGHT],
    outputRange: [HEADER_HEIGHT, 50],
    extrapolate: 'clamp',
  });
  const fadeLogo = offset.interpolate({
    inputRange: [0, HEADER_HEIGHT + 20],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  return (
    <>
      <View style={{position: 'relative', zIndex: 10}}>
        <Animated.View style={{...styles.header, height: headerHeight}}>
          <Text style={styles.headingText}>Amount Tags</Text>
          <Animated.View style={{opacity: fadeLogo}}>
            <ValiuLogo height="40" />
          </Animated.View>
        </Animated.View>
      </View>
      <View style={styles.body}>
        <TagListFromService offset={offset} />
      </View>
      <View style={{marginTop: 6, marginBottom: 12, marginHorizontal: 24}}>
        <ButtonPrimary onPress={() => navigation.navigate('Numpad')}>
          Create amount tag
        </ButtonPrimary>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.light,
    marginBottom: 0,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.white,
    paddingHorizontal: 24,
  },
  headerSeparator: {
    borderTopWidth: 1,
    marginHorizontal: 24,
    marginBottom: 0,
    color: Colors.secondary,
    opacity: 0.25,
  },
  headingText: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  body: {
    paddingHorizontal: 24,
    flex: 1,
  },
});

export default HomeScreen;
