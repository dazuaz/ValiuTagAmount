import * as React from 'react';
import {Animated} from 'react-native';
import {getAllTags, removeTag} from './TagListApi';
import TagsList from './TagList';
import {useTagListDispatch} from './TagListContext';
import {useGlobalDispatch, ActionTypes} from './GlobalContext';

type TagListFromServiceProps = {
  offset: Animated.Value;
  onEdit: (tag: Tag) => void;
};

export const TagListFromService: React.FC<TagListFromServiceProps> = ({
  offset,
  onEdit,
}) => {
  const tagsDispatch = useTagListDispatch();
  const globalDispatch = useGlobalDispatch();

  const handleInitialLoad = React.useCallback(async () => {
    try {
      await getAllTags(tagsDispatch, globalDispatch);
    } catch (error) {}
  }, [tagsDispatch, globalDispatch]);

  React.useEffect(() => {
    handleInitialLoad();
  }, [handleInitialLoad]);

  const handleRemoveTag = async (tag: Tag, index: number) => {
    try {
      await removeTag(tag, index, tagsDispatch, globalDispatch);
    } catch (error) {}
  };

  const handleRefresh = async () => {
    globalDispatch({type: ActionTypes.SET_REFRESHING, payload: true});
    try {
      // TODO: Add paginated load, and load more using a stream/observable Set.
      // Need server paginated feature.
      await handleInitialLoad();
    } catch (error) {}
    globalDispatch({type: ActionTypes.SET_REFRESHING, payload: false});
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
