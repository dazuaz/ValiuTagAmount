import * as React from 'react';
import {Animated} from 'react-native';
import {getAllTags, removeTag} from './TagListApi';
import TagsList from './TagList';
import {ActionTypes, useTagListDispatch} from './TagListContext';

type TagListFromServiceProps = {
  offset: Animated.Value;
  onEdit: (tag: Tag) => void;
};

export const TagListFromService: React.FC<TagListFromServiceProps> = ({
  offset,
  onEdit,
}) => {
  const dispatch = useTagListDispatch();

  const handleInitialLoad = React.useCallback(async () => {
    try {
      await getAllTags(dispatch);
    } catch (error) {}
  }, [dispatch]);
  React.useEffect(() => {
    handleInitialLoad();
  }, [handleInitialLoad]);

  const handleRemoveTag = async (tag: Tag, index: number) => {
    try {
      await removeTag(tag, index, dispatch);
    } catch (error) {}
  };

  const handleRefresh = async () => {
    dispatch({type: ActionTypes.SET_REFRESHING, payload: true});
    try {
      // TODO: Add paginated load, and load more using a stream/observable Set.
      // Need server paginated feature.
      await handleInitialLoad();
    } catch (error) {}
    dispatch({type: ActionTypes.SET_REFRESHING, payload: false});
  };

  return (
    <TagsList
      offset={offset}
      onRefresh={() => handleRefresh()}
      onEdit={onEdit}
      onDelete={(tag: Tag, index: number) => handleRemoveTag(tag, index)}
    />
  );
};
