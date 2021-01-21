/**
 * @format
 */

import 'react-native';
import * as React from 'react';
import TagList from '../lib/features/taglist/TagList';
import {Animated} from 'react-native';
import {TagListProvider} from '../lib/components/TagListContext';
import {GlobalProvider} from '../lib/components/GlobalContext';

// Note: test renderer must be required after react-native.
import {render, waitFor} from '@testing-library/react-native';

const EmptyTagList = () => (
  <GlobalProvider>
    <TagListProvider>
      <TagList
        offset={new Animated.Value(0)}
        onEdit={() => {}}
        onDelete={() => {}}
        onRefresh={() => {}}
      />
    </TagListProvider>
  </GlobalProvider>
);

it('renders idle empty message', async () => {
  const {getByTestId, queryByTestId} = render(<EmptyTagList />);
  await waitFor(() => expect(queryByTestId('empty-list')).toBeTruthy());
  expect(getByTestId('empty-list').props.children).toBe('Valiu rocks!');
});
