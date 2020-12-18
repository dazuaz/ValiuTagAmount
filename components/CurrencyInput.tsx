import React from 'react';
import {TextInput, TextInputProps} from 'react-native';
import {
  useCurrencyState,
  useCurrencyDispatch,
  ActionTypes,
} from './CurrencyInputContext';

/**
 * CurrencyInput
 */
const CurrencyInput: React.FC<TextInputProps> = (props) => {
  const state = useCurrencyState();
  const dispatch = useCurrencyDispatch();

  return (
    <TextInput
      {...props}
      keyboardType="decimal-pad"
      editable={false}
      selectTextOnFocus={false}
      // onSelectionChange={(e) =>
      //   dispatch({
      //     type: ActionTypes.UPDATE_SELECTION,
      //     payload: e.nativeEvent.selection,
      //   })
      // }
      value={state.maskedValue}
      onChangeText={(masked) =>
        dispatch({type: ActionTypes.UPDATE_MASK, payload: masked})
      }
    />
  );
};

export default CurrencyInput;
