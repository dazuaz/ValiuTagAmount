import React from 'react';
import {TextInput} from 'react-native';

/**
 * WARNING: Not for production use, this is intended for a coding exercise
 *
 * This can be refactor to use the locale
 *
 * @see https://observablehq.com/@jokycz/localized-number-parsing/2
 */
class CustomMasker {
  _group: RegExp;
  _decimal: RegExp;
  _formatter: Intl.NumberFormat;
  constructor() {
    this._group = new RegExp(/\./g);
    this._decimal = new RegExp(/,/g);
    this._formatter = new Intl.NumberFormat('es-CO', {
      maximumFractionDigits: 0,
    });
  }
  mask(unmasked: number) {
    return this._formatter.format(unmasked);
  }
  unmask(masked: string) {
    return +masked.replace(this._group, '').replace(this._decimal, '.');
  }
  decimals(masked: string) {
    const maskedComma = masked.split(',');
    if (maskedComma.length > 1) {
      const value = maskedComma[maskedComma.length - 1];
      if (value === '') {
        return ',';
      } else {
        return `,${value}`;
      }
    }
    return '';
  }
}
const masker = new CustomMasker();

/**
 * CurrencyInput
 */
const CurrencyInput: React.FC = () => {
  const [maskedValue, setMaskedValue] = React.useState('0');

  const handleChangeText = (masked: string) => {
    const _number = masker.unmask(masked);
    const _mask = masker.mask(_number);
    // Decimals are handled separatly since the formatter would not allow a naked comma
    const _decimals = masker.decimals(masked);
    setMaskedValue(_mask + _decimals);
  };

  return (
    <TextInput
      keyboardType="decimal-pad"
      style={{
        borderWidth: 1.5,
        height: 48,
        borderColor: '#c4c4c4',
        fontSize: 24,
        paddingHorizontal: 12,
        borderRadius: 10,
      }}
      value={maskedValue}
      onChangeText={(masked) => handleChangeText(masked)}
    />
  );
};

export default CurrencyInput;
