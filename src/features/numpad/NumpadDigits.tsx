import * as React from 'react';
import {Dimensions, Pressable, Text, View, PressableProps} from 'react-native';
// import {ActionTypes, useNumpadDispatch} from './NumpadContext';
import {Backspace, Colors} from '../../components/Theme';
import {insertDigit, insertComma, deleteChar} from './numpadSlice';
import {useDispatch} from 'react-redux';

interface PadProps extends PressableProps {
  action: {
    payload: any;
    type: string;
  };
}

const Pad: React.FC<PadProps> = ({action, children, ...rest}) => {
  const dispatch = useDispatch();
  return (
    <Col>
      <Pressable
        onPress={() => dispatch(action)}
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}
        {...rest}>
        {children}
      </Pressable>
    </Col>
  );
};
const windowHeight = Dimensions.get('window').height;

const NumpadDigits: React.FC = () => {
  const Row: React.FC = ({children}) => (
    <View
      style={{
        flex: 1,
        flexDirection: 'row',
      }}
      children={children}
    />
  );
  return (
    <View
      style={{
        flex: 1,
        paddingHorizontal: 24,
        maxHeight: windowHeight * 0.5,
        minHeight: 400,
      }}>
      <Row>
        <NumberPad number={1} />
        <NumberPad number={2} />
        <NumberPad number={3} />
      </Row>
      <Row>
        <NumberPad number={4} />
        <NumberPad number={5} />
        <NumberPad number={6} />
      </Row>
      <Row>
        <NumberPad number={7} />
        <NumberPad number={8} />
        <NumberPad number={9} />
      </Row>
      <Row>
        <Pad action={insertComma()}>
          <Text>,</Text>
        </Pad>
        <NumberPad number={0} />
        <Pad action={deleteChar()}>
          {({pressed}) => (
            <Backspace
              width={20}
              color={pressed ? Colors.primary : Colors.secondary}
            />
          )}
        </Pad>
      </Row>
    </View>
  );
};

const NumberPad: React.FC<{number: number}> = ({number}) => (
  <Pad action={insertDigit(number)}>
    {({pressed}) => (
      <View
        style={{
          flex: 2,
          width: '90%',
          alignItems: 'center',
          margin: 6,
          justifyContent: 'center',
          backgroundColor: Colors.lightest,
          borderRadius: 6,
          opacity: pressed ? 0.75 : 1,
        }}>
        <Text
          style={{
            fontSize: 18,
            fontWeight: '600',
            color: Colors.secondary,
            opacity: pressed ? 0.75 : 1,
          }}>
          {number}
        </Text>
      </View>
    )}
  </Pad>
);

const Col: React.FC = ({children}) => (
  <View style={{flex: 1}} children={children} />
);

export default NumpadDigits;
