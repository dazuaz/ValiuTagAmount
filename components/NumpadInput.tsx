import React from 'react';
import {TextInput, TextInputProps} from 'react-native';
import {useCurrencyState} from './CurrencyContext';

/**
 * CurrencyInput
 */
const CurrencyInput: React.FC<TextInputProps> = (props) => {
  const state = useCurrencyState();
  return (
    <TextInput
      {...props}
      // Disable native keyboard with some issues
      // https://github.com/facebook/react-native/issues/27243
      autoFocus={true}
      showSoftInputOnFocus={false}
      editable={false}
      selectTextOnFocus={false}
      value={state}
    />
  );
};

export default CurrencyInput;
