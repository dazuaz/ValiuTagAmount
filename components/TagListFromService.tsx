import React, {useEffect} from 'react';
import {Animated, Text} from 'react-native';
import {getAllTags, removeTag} from '../utils/TagsApi';
import TagsList from './TagList';
import useTagsService, {Status} from './useTagsService';

interface TagListFromServiceProps {
  offset: Animated.Value;
}
export const TagListFromService: React.FC<TagListFromServiceProps> = ({
  offset,
}) => {
  const {state, dispatch} = useTagsService();
  console.log('render');
  useEffect(() => {
    dispatch({type: 'UPDATE_STATUS', payload: Status.Loading});
    const loadFromServer = async () => {
      const result = await getAllTags();
      if (result?.status === '200') {
        dispatch({type: 'RESET_TAGS', payload: result.data});
      } else {
        dispatch({type: 'UPDATE_STATUS', payload: Status.Error});
        console.log(result?.message);
        // Log out the error to loggin service
      }
    };
    loadFromServer();
  }, [dispatch]);

  const handleRemoveTag = async (id: string) => {
    dispatch({type: 'REMOVE_TAG', payload: id}); //remove on client
    await removeTag(id); //remove on server TODO: handle failure
  };

  if (state.status === Status.Error) {
    return <Text>Ups, something went wrong...</Text>;
  }

  if (state.status === Status.Loading) {
    return <Text>Loading...</Text>;
  }

  if (!state.tags.length) {
    return <Text>Empty List</Text>;
  }
  return (
    <TagsList
      tags={state.tags}
      offset={offset}
      onDelete={(id: string) => handleRemoveTag(id)}
    />
  );
};
