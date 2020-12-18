import React, {useCallback, useEffect, useRef} from 'react';
import {FlatList, ListRenderItem, Text, View, Animated} from 'react-native';
import {Tag} from '../types';
import {Button, CircleSvg, HEADER_HEIGHT} from './Theme';

type ViewCurrencyProps = {
  currency: string;
};
const formatter = new Intl.NumberFormat('es-CO', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const ViewCurrency: React.FC<ViewCurrencyProps> = ({currency}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 4000,
      useNativeDriver: true,
    });
  }, [fadeAnim]);
  return (
    <Animated.View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        opacity: 1,
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
    </Animated.View>
  );
};

interface TagListItemProps {
  tag: Tag;
  remove: () => void;
}
const TagListItem: React.FC<TagListItemProps> = ({tag, remove}) => {
  // Start the opacity at 0
  const fadeAnim = useRef(new Animated.Value(0)).current;

  /**
   * Helper function for animating the item
   * @param appear - whether the animation should cause the item to appear or disappear
   * @param delay - how long the animation should last (ms)
   * @param callback - callback to be called when the animation finishes
   */
  const _animateItem = useCallback(
    (
      appear: boolean = true,
      delay: number = 300,
      callback: () => void = () => null,
    ) => {
      Animated.timing(fadeAnim, {
        toValue: appear ? 1 : 0,
        duration: delay,
        useNativeDriver: true,
      }).start(callback);
    },
    [fadeAnim],
  );
  // Animate the appearance of the item appearing the first time it loads
  // Empty array in useEffect results in this only occuring on the first render
  React.useEffect(() => {
    _animateItem();
  }, [_animateItem]);

  // Deletes an item from the list. Follows the following order:
  // 1) Animate the item disappearing. On completion:
  // 2) Call the parent to let it know to remove the item from the list
  const _delete = () => {
    _animateItem(false, 200, () => remove());
  };

  return (
    <Animated.View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12,
        opacity: fadeAnim,
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
        <Button onPress={() => _delete()}>Delete</Button>
      </View>
    </Animated.View>
  );
};

interface TagsListProps {
  tags: Tag[];
  onDelete: Function;
  offset: Animated.Value;
}
const TagsList: React.FC<TagsListProps> = ({tags, onDelete, offset}) => {
  const _renderTag: ListRenderItem<Tag> = ({item: tag}) => (
    <TagListItem tag={tag} remove={() => onDelete(tag._id)} />
  );

  return (
    <FlatList
      data={tags}
      showsVerticalScrollIndicator={false}
      style={{paddingTop: HEADER_HEIGHT}}
      contentContainerStyle={{paddingBottom: HEADER_HEIGHT}}
      onScroll={Animated.event([{nativeEvent: {contentOffset: {y: offset}}}], {
        useNativeDriver: false,
      })}
      scrollEventThrottle={16}
      renderItem={_renderTag}
      keyExtractor={(tag) => tag._id}
    />
  );
};

export default TagsList;
