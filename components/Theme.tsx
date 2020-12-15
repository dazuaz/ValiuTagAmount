import React from 'react';
import Svg, {Circle} from 'react-native-svg';
import {Pressable, PressableProps, Text} from 'react-native';

export const Colors = {
  primary: '#1292B4',
  white: '#FFF',
  lighter: '#F3F3F3',
  light: '#DAE1E7',
  dark: '#444',
  black: '#000',
};

type CircleSvgProps = {
  color: string;
};
export const CircleSvg: React.FC<CircleSvgProps> = ({color}) => (
  <Svg height="10" width="10" viewBox="0 0 100 100">
    <Circle cx="50" cy="50" r="45" fill={color} />
  </Svg>
);

export const Button: React.FC<PressableProps> = ({children, ...rest}) => {
  return (
    <Pressable
      {...rest}
      style={{
        backgroundColor: '#f4f4f4',
        paddingVertical: 3,
        paddingHorizontal: 6,
        borderRadius: 4,
      }}>
      <Text>{children}</Text>
    </Pressable>
  );
};
