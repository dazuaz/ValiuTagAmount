import {
  ActionTypes as GlobalTypes,
  Dispatch as GlobalsDispatch,
  Status,
} from './GlobalContext';
import {
  ActionTypes as TagsTypes,
  Dispatch as TagsDispatch,
} from './TagListContext';
import randomColor from 'randomcolor';

const API_BASE_URL = 'http://10.0.2.2:3000/api/tags';

type ValiuResponse<T> = {
  data: T;
  message: string;
  status: string;
};

export const getAllTags = async (
  tagsDispatch: TagsDispatch,
  globalDispatch: GlobalsDispatch,
) => {
  try {
    globalDispatch({type: GlobalTypes.UPDATE_STATUS, payload: Status.Loading});
    const response = await fetch(API_BASE_URL);

    const body: ValiuResponse<Tag[]> = await response.json();
    if (body.status === '200') {
      tagsDispatch({type: TagsTypes.RESET_TAGS, payload: body.data});
    } else {
      globalDispatch({type: GlobalTypes.UPDATE_STATUS, payload: Status.Error});
    }
  } catch (error) {
    globalDispatch({type: GlobalTypes.UPDATE_STATUS, payload: Status.Error});
    throw new Error('Error connecting to the database');
  }
};
export const removeTag = async (
  tag: Tag,
  tagsDispatch: TagsDispatch,
  globalDispatch: GlobalsDispatch,
) => {
  try {
    const response = await fetch(API_BASE_URL + '/' + tag._id, {
      method: 'delete',
    });
    const body: ValiuResponse<Tag> = await response.json(); //remove on server
    if (body.status !== '200') {
      globalDispatch({type: GlobalTypes.UPDATE_STATUS, payload: Status.Error});
    }
  } catch (error) {
    throw new Error('Error connecting to the database');
  }
};
export const modifyTag = async (
  editTag: Tag,
  title: string,
  tagsDispatch: TagsDispatch,
  globalDispatch: GlobalsDispatch,
) => {
  tagsDispatch({type: TagsTypes.MODIFY_TAG, payload: editTag});
  globalDispatch({type: GlobalTypes.SET_REPlACED, payload: editTag._id});

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
export const addTag = async (
  title: string,
  tagsDispatch: TagsDispatch,
  globalDispatch: GlobalsDispatch,
) => {
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
      tagsDispatch({type: TagsTypes.ADD_TAG_SAFE, payload: body.data});
      globalDispatch({type: GlobalTypes.SET_REPlACED, payload: body.data._id});
    } else {
      throw new Error('Error from the backnend API');
    }
  } catch (error) {
    throw new Error('Error connecting to the database');
  }
};
