import {ActionTypes, Dispatch, Status} from './TagListContext';
import randomColor from 'randomcolor';
const API_BASE_URL = 'http://localhost:3000/api/tags';

type ValiuResponse<T> = {
  data: T;
  message: string;
  status: string;
};

export const getAllTags = async (dispatch: Dispatch) => {
  try {
    dispatch({type: ActionTypes.UPDATE_STATUS, payload: Status.Loading});
    const response = await fetch(API_BASE_URL);
    const body: ValiuResponse<Tag[]> = await response.json();
    if (body.status === '200') {
      dispatch({type: ActionTypes.RESET_TAGS, payload: body.data});
    } else {
      dispatch({type: ActionTypes.UPDATE_STATUS, payload: Status.Error});
    }
  } catch (error) {
    dispatch({type: ActionTypes.UPDATE_STATUS, payload: Status.Error});
    throw new Error('Error connecting to the database');
  }
};
export const removeTag = async (
  tag: Tag,
  index: number,
  dispatch: Dispatch,
) => {
  try {
    dispatch({type: ActionTypes.REMOVE_TAG, payload: index}); //remove on client
    const response = await fetch(API_BASE_URL);
    const body: ValiuResponse<Tag> = await response.json(); //remove on server
    if (body.status !== '200') {
      // Restore TAG if server update failed
      dispatch({type: ActionTypes.RESTORE_TAG, payload: {tag, index}});
      dispatch({type: ActionTypes.UPDATE_STATUS, payload: Status.Error});
    }
  } catch (error) {
    throw new Error('Error connecting to the database');
  }
};
export const modifyTag = async (
  editTag: Tag,
  title: string,
  dispatch: Dispatch,
) => {
  dispatch({type: ActionTypes.MODIFY_TAG, payload: editTag});
  try {
    const response = await fetch(API_BASE_URL + '/' + editTag._id, {
      method: 'put',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({...editTag, title}),
    });
    const body: ValiuResponse<Tag> = await response.json(); //remove on server
    if (body.status !== '200') {
      // Rollback
      throw new Error('Error connecting to the database');
    }
  } catch (error) {
    throw new Error('Error connecting to the database');
  }
};
export const addTag = async (title: string, dispatch: Dispatch) => {
  try {
    const response = await fetch(API_BASE_URL, {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({title, color: randomColor()}),
    });
    const body: ValiuResponse<Tag> = await response.json(); //remove on server
    if (body.status === '200') {
      // could improve performance if not dealing wtih race condition.
      dispatch({type: ActionTypes.ADD_TAG_SAFE, payload: body.data});
    } else {
      throw new Error('Error from the backnend API');
    }
  } catch (error) {
    throw new Error('Error connecting to the database');
  }
};
