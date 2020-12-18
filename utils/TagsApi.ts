/**
 * TagsAPI
 * Abstracts CRUD communication with the Tags Service API Backend
 *
 * credits: https://www.carlrippon.com/fetch-with-async-await-and-typescript/
 *
 * @dazuaz
 */

import {Tag} from '../types';
// temp patch: https://github.com/facebook/metro/issues/287#issuecomment-738622439
import {LogBox} from 'react-native';
LogBox.ignoreLogs(['Require cycle: node_modules']);
//

const API_BASE_URL = 'http://localhost:3000/api/tags';

interface ValiuResponse<T> {
  data: T;
  message: string;
  status: string;
}
export const getAllTags = async (): Promise<
  ValiuResponse<Tag[]> | undefined
> => {
  try {
    const response = await get<ValiuResponse<Tag[]>>(API_BASE_URL);
    return response.parsedBody;
  } catch (error) {
    return {
      data: [],
      message: error.toString() || 'Something when wrong',
      status: '500',
    };
  }
};
export const removeTag = async (id: string) => {
  const response = await remove<ValiuResponse<Tag>>(API_BASE_URL + '/' + id);
  return response;
};
export const addTag = async (tag: Tag) => {
  const response = await post<ValiuResponse<Tag>>(API_BASE_URL, tag);
  return response;
};
export const editTag = async (id: string, newTag: Tag) => {
  const response = await put<ValiuResponse<Tag>>(
    API_BASE_URL + '/' + id,
    newTag,
  );
  return response;
};

interface HttpResponse<T> extends Response {
  parsedBody?: T;
}

async function get<T>(
  path: string,
  args: RequestInit = {method: 'get'},
): Promise<HttpResponse<T>> {
  return await http<T>(new Request(path, args));
}

async function post<T>(
  path: string,
  body: any,
  args: RequestInit = {method: 'post', body: JSON.stringify(body)},
): Promise<HttpResponse<T>> {
  return await http<T>(new Request(path, args));
}

async function put<T>(
  path: string,
  body: any,
  args: RequestInit = {method: 'put', body: JSON.stringify(body)},
): Promise<HttpResponse<T>> {
  return await http<T>(new Request(path, args));
}

async function remove<T>(
  path: string,
  args: RequestInit = {method: 'delete'},
): Promise<HttpResponse<T>> {
  return await http<T>(new Request(path, args));
}

async function http<T>(request: RequestInfo): Promise<HttpResponse<T>> {
  const response: HttpResponse<T> = await fetch(request);
  try {
    // may error if there is no body
    response.parsedBody = await response.json();
  } catch (ex) {}

  if (!response.ok) {
    throw new Error(response.statusText);
  }
  return response;
}
