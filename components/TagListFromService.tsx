import React, {useEffect, useState} from 'react';
import {Animated} from 'react-native';
import {getAllTags, removeTag} from '../utils/TagsApi';
import TagsList from './TagList';
import {ActionTypes, Status, useTagListDispatch} from './TagListContext';

interface TagListFromServiceProps {
  offset: Animated.Value;
  onEdit: () => void;
}
export const TagListFromService: React.FC<TagListFromServiceProps> = ({
  offset,
  onEdit,
}) => {
  const [initialLoad, setInitialLoad] = useState(false);
  const dispatch = useTagListDispatch();

  useEffect(() => {
    const handleInitialLoad = async () => {
      try {
        dispatch({type: 'UPDATE_STATUS', payload: Status.Loading});
        const result = await getAllTags();
        if (result?.status === '200') {
          dispatch({type: 'RESET_TAGS', payload: result.data});
        } else {
          dispatch({type: 'UPDATE_STATUS', payload: Status.Error});
        }
      } catch (error) {
        throw new Error('Error connecting to the database');
      }
    };
    if (!initialLoad) {
      handleInitialLoad();
      setInitialLoad(true);
    }
  }, [initialLoad, dispatch]);

  const handleRemoveTag = async (id: string) => {
    await removeTag(id); //remove on server TODO: handle failure
    dispatch({type: 'REMOVE_TAG', payload: id}); //remove on client
  };

  const handleRefresh = async () => {
    dispatch({type: 'SET_REFRESHING', payload: true});
    const result = await getAllTags();
    if (result?.status === '200') {
      if (result.data.length) {
        dispatch({type: ActionTypes.RESET_TAGS, payload: result.data});
      }
    }
    dispatch({type: 'SET_REFRESHING', payload: false});
  };

  return (
    <TagsList
      offset={offset}
      onRefresh={() => handleRefresh()}
      onEdit={onEdit}
      onDelete={(id: string) => handleRemoveTag(id)}
    />
  );
};
