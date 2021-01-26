import * as React from 'react';
import {
  ListRenderItem,
  Text,
  View,
  Animated,
  RefreshControl,
  Platform,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from 'react-native';

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

const formatter = new CustomMasker();
interface TagListItemProps {
  tag: Tag;
  style: StyleProp<ViewStyle>;
  remove: () => void;
  edit: () => void;
}
const TagListItem: React.FC<TagListItemProps> = ({
  tag,
  remove,
  edit,
  style,
}) => {
  return (
    <View style={[itemSyles.container, style]}>
      <View style={itemSyles.circleContainer}>
        <CircleSvg color={tag.color} />
      </View>
      <View style={currencySyles.container}>
        <View style={currencySyles.separator} />
        <View style={currencySyles.currencyContainer}>
          <Text style={currencySyles.currency}>
            {formatter.mask(tag.title)}
          </Text>
        </View>
        <View style={currencySyles.separator} />
        <View style={currencySyles.separator} />
      </View>
      <View style={itemSyles.buttonsContainer}>
        <ButtonTag onPress={() => edit()}>Edit</ButtonTag>
        <View style={itemSyles.separator} />
        <ButtonTag onPress={() => remove()}>Delete</ButtonTag>
      </View>
    </View>
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
  onDelete: (tagId: string) => void;
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
  const _renderTag: ListRenderItem<Tag> = ({item: tag}) => {
    const backgroundColor =
      tag._id === lastReplacedId ? Colors.lightest : Colors.white;
    return (
      <TagListItem
        tag={tag}
        style={{backgroundColor}}
        remove={() => onDelete(tag._id)}
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
