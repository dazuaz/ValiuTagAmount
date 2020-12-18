import React, {useCallback, useRef} from 'react';
import {
  ListRenderItem,
  Text,
  View,
  Animated,
  RefreshControl,
} from 'react-native';
import {Tag} from '../types';
import {Status, useTagListState} from './TagListContext';
import {Button, CircleSvg, HEADER_HEIGHT, Colors} from './Theme';

type ViewCurrencyProps = {
  currency: string;
};
const formatter = new Intl.NumberFormat('es-CO', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const ViewCurrency: React.FC<ViewCurrencyProps> = ({currency}) => {
  return (
    <Animated.View
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
    </Animated.View>
  );
};

interface TagListItemProps {
  tag: Tag;
  isFocus?: boolean;
  remove: () => void;
  edit: () => void;
}
const TagListItem: React.FC<TagListItemProps> = ({
  tag,
  remove,
  edit,
  isFocus,
}) => {
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
      duration: number = 400,
      callback: () => void = () => null,
    ) => {
      Animated.timing(fadeAnim, {
        toValue: appear ? 1 : 0,
        duration: duration,
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
        paddingHorizontal: 24,
        backgroundColor: isFocus ? Colors.lightest : Colors.white,
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
        <Button onPress={() => edit()}>Edit</Button>
        <View style={{width: 6}} />
        <Button onPress={() => _delete()}>Delete</Button>
      </View>
    </Animated.View>
  );
};

const EmptyList: React.FC<{state: Status}> = ({state}) => {
  const _message = () => {
    switch (state) {
      case Status.Error:
        return 'Error loading data.';
      case Status.Loaded:
        return 'No tags found.';
      case Status.Loading:
        return 'Loading...';
      case Status.Idle:
        return 'Valiu rocks!';
      default:
        return 'No tags found';
    }
  };
  return (
    <Text testID="empty-list" style={{marginTop: 12, textAlign: 'center'}}>
      {_message()}
    </Text>
  );
};
type TagsListProps = {
  onEdit: Function;
  onDelete: Function;
  onRefresh: Function;
  offset: Animated.Value;
};
const TagsList: React.FC<TagsListProps> = ({
  onDelete,
  onRefresh,
  onEdit,
  offset,
}) => {
  const state = useTagListState();

  const _renderTag: ListRenderItem<Tag> = ({item: tag}) => (
    <TagListItem
      tag={tag}
      isFocus={tag._id === state.lastReplacedId}
      remove={() => onDelete(tag._id)}
      edit={() => onEdit(tag)}
    />
  );

  return (
    <Animated.FlatList
      data={state.tags}
      showsVerticalScrollIndicator={false}
      contentInset={{
        top: HEADER_HEIGHT,
      }}
      contentOffset={{
        x: 0,
        y: -HEADER_HEIGHT,
      }}
      onScroll={Animated.event([{nativeEvent: {contentOffset: {y: offset}}}], {
        useNativeDriver: true,
      })}
      refreshControl={
        <RefreshControl
          refreshing={state.refreshing}
          onRefresh={() => onRefresh()}
        />
      }
      ListEmptyComponent={<EmptyList state={state.status} />}
      scrollEventThrottle={16}
      renderItem={_renderTag}
      keyExtractor={(tag) => tag._id}
    />
  );
};

export default TagsList;
