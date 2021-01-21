import randomColor from 'randomcolor';

const API_BASE_URL = 'http://10.0.2.2:3000/api/tags';
type ValiuResponse<T> = {
  data: T;
  message: string;
  status: string;
};

export const getAllTags = async (): Promise<ValiuResponse<Tag[]>> => {
  const url = API_BASE_URL;
  try {
    const response = await fetch(url);
    return await response.json();
  } catch (error) {
    throw new Error('Error connecting to the database');
  }
};

export const removeTag = async (
  tagId: string,
): Promise<ValiuResponse<null>> => {
  const url = API_BASE_URL + '/' + tagId;
  try {
    const response = await fetch(url, {
      method: 'delete',
    });
    return await response.json(); //remove on server
  } catch (error) {
    throw new Error('Error connecting to the database');
  }
};
export const modifyTag = async (
  editTag: Tag,
  title: string,
): Promise<ValiuResponse<Tag>> => {
  const url = API_BASE_URL + '/' + editTag._id;
  try {
    const response = await fetch(url, {
      method: 'put',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({...editTag, title}),
    });
    return await response.json();
  } catch (error) {
    throw new Error('Error connecting to the database');
  }
};
export const addTag = async (title: string): Promise<ValiuResponse<Tag>> => {
  const url = API_BASE_URL;
  try {
    const response = await fetch(url, {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({title, color: randomColor()}),
    });
    return await response.json();
  } catch (error) {
    throw new Error('Error connecting to the database');
  }
};
