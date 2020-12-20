import * as React from 'react';
import {Animated} from 'react-native';
import TagsList from './TagList';
import {Status, useTagListDispatch} from './TagListContext';

const API_BASE_URL = 'http://localhost:3000/api/tags';

type TagListFromServiceProps = {
  offset: Animated.Value;
  onEdit: (tag: Tag) => void;
};

type ValiuResponse<T> = {
  data: T;
  message: string;
  status: string;
};

export const TagListFromService: React.FC<TagListFromServiceProps> = ({
  offset,
  onEdit,
}) => {
  const dispatch = useTagListDispatch();

  const handleInitialLoad = React.useCallback(async () => {
    try {
      dispatch({type: 'UPDATE_STATUS', payload: Status.Loading});
      const response = await fetch(API_BASE_URL);
      const body: ValiuResponse<Tag[]> = await response.json();
      if (body.status === '200') {
        dispatch({type: 'RESET_TAGS', payload: body.data});
      } else {
        dispatch({type: 'UPDATE_STATUS', payload: Status.Error});
      }
    } catch (error) {
      dispatch({type: 'UPDATE_STATUS', payload: Status.Error});
      // throw new Error('Error connecting to the database');
    }
  }, [dispatch]);
  React.useEffect(() => {
    handleInitialLoad();
  }, [handleInitialLoad]);

  const handleRemoveTag = async (tag: Tag, index: number) => {
    try {
      dispatch({type: 'REMOVE_TAG', payload: index}); //remove on client
      const response = await fetch(API_BASE_URL);
      const body: ValiuResponse<Tag> = await response.json(); //remove on server
      if (body.status !== '200') {
        // Restore TAG if server update failed
        dispatch({type: 'UPDATE_STATUS', payload: Status.Error});
        dispatch({type: 'RESTORE_TAG', payload: {tag, index}});
      }
    } catch (error) {
      dispatch({type: 'UPDATE_STATUS', payload: Status.Error});
      dispatch({type: 'RESTORE_TAG', payload: {tag, index}});
      // throw new Error('Error connecting to the database');
    }
  };

  const handleRefresh = async () => {
    dispatch({type: 'SET_REFRESHING', payload: true});
    await handleInitialLoad();
    dispatch({type: 'SET_REFRESHING', payload: false});
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
