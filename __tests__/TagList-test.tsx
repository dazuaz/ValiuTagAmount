/**
 * @format
 */

import 'react-native';
import * as React from 'react';
import TagList from '../components/TagList';
import {Animated} from 'react-native';
import {TagListProvider} from '../components/TagListContext';

// Note: test renderer must be required after react-native.
import {render, waitFor} from '@testing-library/react-native';

const EmptyTagList = () => (
  <TagListProvider>
    <TagList
      offset={new Animated.Value(0)}
      onEdit={() => {}}
      onDelete={() => {}}
      onRefresh={() => {}}
    />
  </TagListProvider>
);

it('renders idle empty message', async () => {
  const {getByTestId, queryByTestId} = render(<EmptyTagList />);
  await waitFor(() => expect(queryByTestId('empty-list')).toBeTruthy());
  expect(getByTestId('empty-list').props.children).toBe('Valiu rocks!');
});
