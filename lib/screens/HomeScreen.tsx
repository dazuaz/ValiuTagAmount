import * as React from 'react';
import {
  Animated,
  StyleSheet,
  View,
  Dimensions,
  LayoutRectangle,
} from 'react-native';
import {TagListFromService} from '../features/taglist/TagListFromService';
import {StackNavigationProp} from '@react-navigation/stack';

import {
  Colors,
  ValiuLogo,
  ButtonPrimary,
  HEADER_HEIGHT,
  CONTENT_PADDING,
} from '../components/Theme';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

type HomeScreenProps = {
  navigation: HomeScreenNavigationProp;
};
const windowWidth = Dimensions.get('window').width;

const HomeScreen: React.FC<HomeScreenProps> = ({navigation}) => {
  // the offset Animated.Value is passed down to the TagsList FlatList onScroll event
  const offset = React.useRef(new Animated.Value(0.01)).current;

  // It would be simpler to modify the height of the container but it is not supported by useNativeDrive *
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
    outputRange: [0, -40],
    extrapolate: 'clamp',
  });

  const animatedHeader = [
    styles.header,
    {
      transform: [{translateY: containerOffset}],
    },
  ];
  const animatedLogo = [
    {
      opacity: fadeLogo,
    },
  ];
  return (
    <View style={styles.homeScreen}>
      <View style={styles.headerContainer}>
        <Animated.View style={animatedHeader}>
          <AnimatedHeaderText offset={offset} />
          <Animated.View style={animatedLogo}>
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
type AnimatedHeaderTextProps = {
  offset: Animated.Value;
};

const AnimatedHeaderText: React.FC<AnimatedHeaderTextProps> = ({offset}) => {
  const [travelDistance, setTravelDistance] = React.useState(0);

  // useMemo to avoid recalculating when we set the travelDistance
  const scaleTitle = React.useMemo(
    () =>
      offset.interpolate({
        inputRange: [0, HEADER_HEIGHT],
        outputRange: [1, 0.75],
        extrapolate: 'clamp',
      }),
    [offset],
  );
  const titleOffsetY = React.useMemo(
    () =>
      offset.interpolate({
        inputRange: [0, HEADER_HEIGHT],
        outputRange: [0, 25],
        extrapolate: 'clamp',
      }),
    [offset],
  );
  const titleTranslateX = offset.interpolate({
    inputRange: [0, HEADER_HEIGHT],
    outputRange: [0, travelDistance],
    extrapolate: 'clamp',
  });

  const animatedHeaderTitle = [
    styles.headerTitle,
    {
      transform: [
        {translateY: titleOffsetY},
        {translateX: titleTranslateX},
        {scale: scaleTitle},
      ],
    },
  ];
  const findTravelDistance = (layout: LayoutRectangle) => {
    const {x, width} = layout;
    setTravelDistance(windowWidth / 2 - (width / 2 + x));
  };
  return (
    <Animated.Text
      onLayout={(event) => findTravelDistance(event.nativeEvent.layout)}
      style={animatedHeaderTitle}>
      Amount tags
    </Animated.Text>
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
    paddingHorizontal: CONTENT_PADDING,
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
