import React from 'react';
import {FlatList, ListRenderItem, Text, View} from 'react-native';
import {Tag} from '../types';
import {Button, CircleSvg} from './Theme';

type ViewCurrencyProps = {
  currency: string;
};
const formatter = new Intl.NumberFormat('es-CO', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const ViewCurrency: React.FC<ViewCurrencyProps> = ({currency}) => (
  <View
    style={{
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    }}>
    <View style={{width: 20}} />
    <View style={{flex: 1}}>
      <Text
        style={{
          fontVariant: ['tabular-nums'],
          fontSize: 24,
          textAlign: 'right',
        }}>
        {currency}
      </Text>
    </View>
    <View style={{width: 40}} />
  </View>
);

type TagsListProps = {
  tags: Tag[];
  handleRemoveTag: Function;
};
const TagsList: React.FC<TagsListProps> = ({tags, handleRemoveTag}) => {
  const _renderTag: ListRenderItem<Tag> = ({item: tag}) => (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12,
      }}>
      <View style={[{alignItems: 'center', justifyContent: 'center'}]}>
        <CircleSvg color={tag.color} />
      </View>
      <ViewCurrency currency={formatter.format(+tag.title)} />
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <Button>Edit</Button>
        <View style={{width: 6}} />
        <Button onPress={() => handleRemoveTag(tag._id)}>Delete</Button>
      </View>
    </View>
  );
  if (!tags.length) return <Text>Empty List</Text>;
  return (
    <FlatList
      data={tags}
      renderItem={_renderTag}
      keyExtractor={(tag) => tag._id}
    />
  );
};

export default TagsList;
