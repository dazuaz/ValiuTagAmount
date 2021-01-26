import * as React from 'react';
import {Animated} from 'react-native';
import TagsList from './TagList';
import {useDispatch} from 'react-redux';

import {fetchTags, handleRemoveTag} from './tagsSlice';

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

  const handleDelete = (tagId: string) => {
    dispatch(handleRemoveTag({tagId}));
  };

  const handleRefresh = () => {
    dispatch(fetchTags());
  };

  return (
    <TagsList
      offset={offset}
      onRefresh={() => handleRefresh()}
      onEdit={onEdit}
      onDelete={(tagId) => handleDelete(tagId)}
    />
  );
};
