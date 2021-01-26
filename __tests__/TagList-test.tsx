/**
 * @format
 */

import 'react-native';
import * as React from 'react';
import TagList from '../lib/features/taglist/TagList';
import {Animated} from 'react-native';

// Note: test renderer must be required after react-native.
import {render, waitFor} from '@testing-library/react-native';
import {Provider} from 'react-redux';
import store from '../lib/store';
const EmptyTagList = () => (
  <Provider store={store}>
    <TagList
      offset={new Animated.Value(0)}
      onEdit={() => {}}
      onDelete={() => {}}
      onRefresh={() => {}}
    />
  </Provider>
);

it('renders idle empty message', async () => {
  const {getByTestId, queryByTestId} = render(<EmptyTagList />);
  await waitFor(() => expect(queryByTestId('empty-list')).toBeTruthy());
  expect(getByTestId('empty-list').props.children).toBe('Valiu rocks!');
});
