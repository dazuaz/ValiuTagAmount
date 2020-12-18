import React from 'react';
import {Dimensions, Pressable, Text, View} from 'react-native';
import {ActionTypes, useCurrencyDispatch} from './CurrencyInputContext';

type PadProps = {
  number?: number;
  type?: ActionTypes;
};

const Pad: React.FC<PadProps> = ({
  number,
  type = ActionTypes.INSERT_NUMBER,
  children,
}) => {
  const dispatch = useCurrencyDispatch();

  return (
    <Col>
      <Pressable
        onPress={() => dispatch({type: type, payload: number})}
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        {children}
      </Pressable>
    </Col>
  );
};

const Numpad = () => {
  const windowHeight = Dimensions.get('window').height;
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
        <Pad type={ActionTypes.INSERT_COMMA}>
          <Text>,</Text>
        </Pad>
        <NumberPad number={0} />
        <Pad type={ActionTypes.DELETE}>
          <Text>Del</Text>
        </Pad>
      </Row>
    </View>
  );
};

const NumberPad: React.FC<{number: number}> = ({number}) => (
  <Pad number={number}>
    <Text
      style={{
        fontSize: 18,
        fontWeight: '600',
      }}>
      {number}
    </Text>
  </Pad>
);

const Col: React.FC = ({children}) => (
  <View style={{flex: 1}} children={children} />
);

export default Numpad;
