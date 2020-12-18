import {StackNavigationProp} from '@react-navigation/stack';
import React from 'react';
import {View, Text, Pressable} from 'react-native';
import CurrencyInput from '../components/CurrencyInput';
import {CurrencyInputProvider} from '../components/CurrencyInputContext';
import Numpad from '../components/Numpad';
import {ButtonPrimary, Colors, ArrowLeft} from '../components/Theme';
import {RootStackParamList} from '../types';

type NumpadScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Home'
>;

type NumpadScreenProps = {
  navigation: NumpadScreenNavigationProp;
};

const NumpadScreen: React.FC<NumpadScreenProps> = ({navigation}) => {
  console.log('NumpadScreen render');
  return (
    <>
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
            Add amount tag
          </Text>
        </View>
      </View>
      <CurrencyInputProvider>
        <View style={{paddingHorizontal: 24}}>
          <View style={{flexDirection: 'row'}}>
            <View style={{width: '70%'}}>
              <CurrencyInput
                // Disable native keyboard with some issues
                // https://github.com/facebook/react-native/issues/27243
                autoFocus={true}
                showSoftInputOnFocus={false}
                style={{
                  flex: 1,
                  borderBottomWidth: 1.5,
                  borderColor: Colors.primary,
                  backgroundColor: Colors.white,
                  fontSize: 24,
                  paddingHorizontal: 12,
                  borderRadius: 4,
                }}
              />
            </View>
            <View style={{width: '30%'}}>
              <ButtonPrimary style={{marginLeft: 12}}>Add</ButtonPrimary>
            </View>
          </View>
        </View>
        <View style={{flex: 1, marginTop: 48}}>
          <Numpad />
        </View>
      </CurrencyInputProvider>
    </>
  );
};

export default NumpadScreen;
