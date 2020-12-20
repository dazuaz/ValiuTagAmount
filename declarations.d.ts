declare type Tag = {
  __v?: string;
  _id: string;
  title: string;
  color: string;
  created_at?: string;
  updated_at?: string;
};
declare type RootStackParamList = {
  Home: undefined;
  Numpad: {tag: Tag} | undefined;
};

// https://github.com/kristerkari/react-native-svg-transformer#using-typescript
declare module '*.svg' {
  import * as React from 'react';
  import {SvgProps} from 'react-native-svg';
  const content: React.FC<SvgProps>;
  export default content;
}
