import * as React from 'react';
import {
  ListRenderItem,
  Text,
  View,
  Animated,
  RefreshControl,
  Platform,
  StyleSheet,
} from 'react-native';
// import {useTagListState} from './TagListContext';
import {useSelector} from 'react-redux';
import {
  selectTags,
  selectStatus,
  selectLastReplacedId,
  Status,
} from './tagsSlice';
import {
  CircleSvg,
  HEADER_HEIGHT,
  Colors,
  ButtonTag,
} from '../../components/Theme';
import {CustomMasker} from '../../utils/CustomMasker';

type ViewCurrencyProps = {
  currency: string;
};

const formatter = new CustomMasker();

const ViewCurrency: React.FC<ViewCurrencyProps> = ({currency}) => (
  <View style={currencySyles.container}>
    <View style={currencySyles.separator} />
    <View style={currencySyles.currencyContainer}>
      <Text style={currencySyles.currency}>{formatter.mask(currency)}</Text>
    </View>
    <View style={currencySyles.separator} />
    <View style={currencySyles.separator} />
  </View>
);
const currencySyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  separator: {width: 20},
  currencyContainer: {flex: 1},
  currency: {
    fontVariant: ['tabular-nums'],
    fontSize: 20,
  },
});

interface TagListItemProps {
  tag: Tag;
  backgroundColor?: string;
  remove: () => void;
  edit: () => void;
}
const TagListItem: React.FC<TagListItemProps> = ({
  tag,
  remove,
  edit,
  backgroundColor,
}) => {
  // Start the opacity at 0
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  // const currency = React.useMemo(() => formatter.mask(tag.title), [tag.title]);
  /**
   * Helper function for animating the item
   * @param appear - whether the animation should cause the item to appear or disappear
   * @param delay - how long the animation should last (ms)
   * @param callback - callback to be called when the animation finishes
   */
  const _animateItem = React.useCallback(
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
    _animateItem(false, 100, () => remove());
  };
  const animatedTag = [
    itemSyles.container,
    {
      backgroundColor: backgroundColor,
      opacity: fadeAnim,
    },
  ];
  return (
    <Animated.View style={animatedTag}>
      <View style={itemSyles.circleContainer}>
        <CircleSvg color={tag.color} />
      </View>
      <ViewCurrency currency={tag.title} />
      <View style={itemSyles.buttonsContainer}>
        <ButtonTag onPress={() => edit()}>Edit</ButtonTag>
        <View style={itemSyles.separator} />
        <ButtonTag onPress={() => _delete()}>Delete</ButtonTag>
      </View>
    </Animated.View>
  );
};
const itemSyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  circleContainer: {alignItems: 'center', justifyContent: 'center'},
  separator: {width: 6},
  buttonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

const EmptyList: React.FC<{state: Status}> = ({state}) => {
  const _message = () => {
    switch (state) {
      case Status.Error:
        return 'Error loading data.';
      case Status.Loaded:
        return 'No tags found.';
      case Status.Loading:
        return '';
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
  onEdit: (tag: Tag) => void;
  onDelete: (tag: Tag, index: number) => void;
  onRefresh: () => void;
  offset: Animated.Value;
};
const TagsList: React.FC<TagsListProps> = ({
  onDelete,
  onRefresh,
  onEdit,
  offset,
}) => {
  const tags = useSelector(selectTags);
  const status = useSelector(selectStatus);
  const lastReplacedId = useSelector(selectLastReplacedId);
  // const status = Status.Idle;
  const _renderTag: ListRenderItem<Tag> = ({item: tag, index}) => {
    const backgroundColor =
      tag._id === lastReplacedId ? Colors.lightest : Colors.white;
    return (
      <TagListItem
        tag={tag}
        backgroundColor={backgroundColor}
        remove={() => onDelete(tag, index)}
        edit={() => onEdit(tag)}
      />
    );
  };
  return (
    <Animated.FlatList
      data={tags}
      contentContainerStyle={{
        paddingTop: Platform.select({android: HEADER_HEIGHT, ios: 0}),
      }}
      showsVerticalScrollIndicator={false}
      contentInset={{
        top: HEADER_HEIGHT,
      }}
      contentOffset={{
        x: 0,
        y: Platform.select({android: 0, ios: -HEADER_HEIGHT}) ?? 0,
      }}
      onScroll={Animated.event([{nativeEvent: {contentOffset: {y: offset}}}], {
        useNativeDriver: true,
      })}
      automaticallyAdjustContentInsets={false}
      refreshControl={
        <RefreshControl
          refreshing={status === Status.Loading}
          onRefresh={() => onRefresh()}
          progressViewOffset={HEADER_HEIGHT}
        />
      }
      ListEmptyComponent={<EmptyList state={status} />}
      renderItem={_renderTag}
      keyExtractor={(tag) => tag._id}
      extraData={lastReplacedId}
    />
  );
};

export default TagsList;
