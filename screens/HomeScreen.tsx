import React, {useRef} from 'react';
import {Animated, StyleSheet, View} from 'react-native';
import {TagListFromService} from '../components/TagListFromService';
import {StackNavigationProp} from '@react-navigation/stack';

import {
  Colors,
  ValiuLogo,
  ButtonPrimary,
  HEADER_HEIGHT,
} from '../components/Theme';
import {RootStackParamList, Tag} from '../types';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

type HomeScreenProps = {
  navigation: HomeScreenNavigationProp;
};

const HomeScreen: React.FC<HomeScreenProps> = ({navigation}) => {
  // the offset Animated.Value is passed down to the TagsList FlatList onScroll event
  const offset = useRef(new Animated.Value(0)).current;

  // It would be simpler to modify the height of the container but it is not yet supported by useNativeDrive *
  // Translating looks good on iOS simulator, but since we are translating outside of the safeview,
  // I advice testing on more real devices
  // * https://github.com/facebook/react-native/blob/c3d072955024824d7ff6113fc9f642d25c462f16/Libraries/Animated/src/NativeAnimatedHelper.js#L186
  const fadeLogo = offset.interpolate({
    inputRange: [0, HEADER_HEIGHT],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });
  const containerOffset = offset.interpolate({
    inputRange: [0, HEADER_HEIGHT],
    outputRange: [0, -30],
    extrapolate: 'clamp',
  });
  const titleOffset = offset.interpolate({
    inputRange: [0, HEADER_HEIGHT],
    outputRange: [0, 15],
    extrapolate: 'clamp',
  });
  const animatedHeader = [
    styles.header,
    {
      transform: [{translateY: containerOffset}],
    },
  ];
  const animatedHeaderTitle = [
    styles.headerTitle,
    {
      transform: [{translateY: titleOffset}],
    },
  ];

  return (
    <View style={styles.homeScreen}>
      <View style={styles.headerContainer}>
        <Animated.View style={animatedHeader}>
          <Animated.Text style={animatedHeaderTitle}>Amount Tags</Animated.Text>
          <Animated.View style={{opacity: fadeLogo}}>
            <ValiuLogo height={40} />
          </Animated.View>
        </Animated.View>
      </View>
      <View style={styles.body}>
        <TagListFromService
          offset={offset}
          onEdit={(tag: Tag) => navigation.navigate('Numpad', {tag})}
        />
      </View>
      <View style={styles.buttonContainer}>
        <ButtonPrimary onPress={() => navigation.navigate('Numpad')}>
          Create amount tag
        </ButtonPrimary>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  homeScreen: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  headerContainer: {
    position: 'relative',
    zIndex: 10,
  },
  header: {
    height: HEADER_HEIGHT,
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
    bottom: 0,
    backgroundColor: Colors.white,
    paddingHorizontal: 24,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  body: {
    flex: 1,
  },
  buttonContainer: {
    marginTop: 6,
    marginBottom: 12,
    marginHorizontal: 24,
  },
});

export default HomeScreen;
