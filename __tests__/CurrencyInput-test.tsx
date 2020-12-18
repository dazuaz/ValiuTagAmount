/**
 * @format
 */

import 'react-native';
import React from 'react';
import CurrencyInput from '../components/CurrencyInput';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

it('renders correctly', () => {
  renderer.create(<CurrencyInput />);
});
