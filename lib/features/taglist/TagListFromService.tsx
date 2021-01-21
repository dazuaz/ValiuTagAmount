import * as React from 'react';
import {Animated} from 'react-native';
import {removeTag} from './tagsSlice';
import TagsList from './TagList';
import {useDispatch} from 'react-redux';

import {fetchTags} from './tagsSlice';

type TagListFromServiceProps = {
  offset: Animated.Value;
  onEdit: (tag: Tag) => void;
};

export const TagListFromService: React.FC<TagListFromServiceProps> = ({
  offset,
  onEdit,
}) => {
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(fetchTags());
  }, [dispatch]);

  const handleRemoveTag = async (tag: Tag) => {
    dispatch(removeTag(tag._id));
  };

  const handleRefresh = () => {
    dispatch(fetchTags());
  };

  return (
    <TagsList
      offset={offset}
      onRefresh={() => handleRefresh()}
      onEdit={onEdit}
      onDelete={(tag: Tag) => handleRemoveTag(tag)}
    />
  );
};
