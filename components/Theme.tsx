import * as React from 'react';
import Svg, {Circle, SvgProps} from 'react-native-svg';
import {Pressable, PressableProps, StyleSheet, Text} from 'react-native';
import Logo from '../assets/logo_valiu.svg';
import ArrowLeftSvg from '../assets/arrow_left.svg';
import BackspaceSvg from '../assets/backspace.svg';

// Valiu logo aspec ratio: width="106"/height="40"
export const ValiuLogo: React.FC<SvgProps> = (props) => (
  <Logo
    height={props.width ? +props.width * (40 / 106) : undefined}
    width={props.height ? +props.height * (106 / 40) : undefined}
    {...props}
  />
);
export const ArrowLeft: React.FC<SvgProps> = (props) => (
  <ArrowLeftSvg
    height={props.width ? +props.width : 20}
    width={props.height ? +props.height : 20}
    {...props}
  />
);
export const Backspace: React.FC<SvgProps> = (props) => (
  <BackspaceSvg
    height={props.width ? +props.width : 20}
    width={props.height ? +props.height : 20}
    {...props}
  />
);
export const CircleSvg: React.FC<SvgProps> = ({color}) => (
  <Svg height="10" width="10" viewBox="0 0 100 100">
    <Circle cx="50" cy="50" r="45" fill={color} />
  </Svg>
);
export const HEADER_HEIGHT = 100;
export const CONTENT_PADDING = 24;
export const Colors = {
  primary: '#4953CF',
  secondary: '#22354C',
  white: '#FFF',
  lighter: '#F3F3F3',
  light: '#DAE1E7',
  lightest: '#F3F4F6',
  dark: '#444',
  black: '#000',
};

export const ButtonTag: React.FC<PressableProps> = ({children, ...rest}) => {
  return (
    <Pressable {...rest} style={buttonTagStyles.container}>
      <Text>{children}</Text>
    </Pressable>
  );
};
const buttonTagStyles = StyleSheet.create({
  container: {
    backgroundColor: '#f4f4f4',
    paddingVertical: 3,
    paddingHorizontal: 6,
    borderRadius: 4,
  },
});
const styleJoiner = (...arg: any) => StyleSheet.flatten(arg);

export const ButtonPrimary: React.FC<PressableProps> = ({
  children,
  ...rest
}) => {
  return (
    <Pressable
      {...rest}
      style={styleJoiner(
        primaryButtonStyles.pressable,
        primaryButtonStyles.shadow2,
        rest.style,
      )}>
      {({pressed}) => (
        <Text
          style={{
            color: pressed ? Colors.light : Colors.white,
            fontSize: 18,
            fontWeight: '600',
          }}>
          {children}
        </Text>
      )}
    </Pressable>
  );
};

const primaryButtonStyles = StyleSheet.create({
  shadow5: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  shadow2: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
  pressable: {
    backgroundColor: Colors.primary,
    alignItems: 'center',
    paddingVertical: 20,
    borderRadius: 10,
  },
});
