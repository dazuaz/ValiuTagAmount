import React from 'react';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {View, Text, Pressable} from 'react-native';

import {CurrencyProvider} from '../components/CurrencyContext';
import Numpad from '../components/Numpad';
import {Colors, ArrowLeft} from '../components/Theme';
import {RootStackParamList} from '../types';

type NumpadScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Numpad'
>;

type NumpadScreenRouteProp = RouteProp<RootStackParamList, 'Numpad'>;

type NumpadScreenProps = {
  navigation: NumpadScreenNavigationProp;
  route: NumpadScreenRouteProp;
};

const NumpadScreen: React.FC<NumpadScreenProps> = ({navigation, route}) => {
  return (
    <View style={{flex: 1, backgroundColor: Colors.white}}>
      <View style={{flexDirection: 'row'}}>
        <View
          style={{
            paddingHorizontal: 24,
            paddingVertical: 36,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Pressable onPress={() => navigation.goBack()}>
            <ArrowLeft width={28} color={Colors.secondary} />
          </Pressable>
          <Text
            style={{
              fontSize: 24,
              fontWeight: '600',
              color: Colors.black,
              marginLeft: 12,
            }}>
            {route.params?.tag?._id ? 'Edit' : 'Add'} amount tag
          </Text>
        </View>
      </View>
      <CurrencyProvider>
        <Numpad
          goBack={() => navigation.goBack()}
          editTag={route.params?.tag}
        />
      </CurrencyProvider>
    </View>
  );
};

export default NumpadScreen;
