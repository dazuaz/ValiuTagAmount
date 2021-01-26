import * as React from 'react';
import {TextInput, TextInputProps} from 'react-native';
// import {useNumpadState} from './NumpadContext';
import {useSelector} from 'react-redux';
import {selectNumpad} from './numpadSlice';
/**
 * CurrencyInput
 */
const CurrencyInput: React.FC<TextInputProps> = (props) => {
  // const state = useNumpadState();
  const state = useSelector(selectNumpad);

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
