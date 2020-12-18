/**
 * @format
 */

import 'react-native';
import React from 'react';
import App from '../App';
import {render, waitFor} from '@testing-library/react-native';
// Note: test renderer must be required after react-native.
// Silence the warning https://github.com/facebook/react-native/issues/11094#issuecomment-263240420
// jest.mock('react-native/Libraries/Animated/src/NativeAnimatedHelper');
it('renders no connection message after failed load of items', async () => {
  const {getByTestId, queryByTestId} = render(<App />);
  await waitFor(() => expect(queryByTestId('empty-list')).toBeTruthy());
  expect(getByTestId('empty-list').props.children).toBe('Error loading data.');
});
