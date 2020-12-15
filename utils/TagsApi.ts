/**
 * TagsAPI
 * Enables CRUD communication with the Tags Service API
 */
// inspiration: https://www.carlrippon.com/fetch-with-async-await-and-typescript/

import {Tag} from '../types';

const url = 'http://localhost:3000';
const endpoint = '/api/tags';

interface ValiuResponse<T> {
  data: T;
  message: string;
  status: string;
}

export const getAllTags = async () => {
  const response = await get<ValiuResponse<Tag[]>>(url + endpoint);
  return response;
};
export const removeTag = async (id: string) => {
  const response = await remove<ValiuResponse<Tag>>(url + endpoint + '/' + id);
  return response;
};
export const addTag = async (tag: Tag) => {
  const response = await post<ValiuResponse<Tag>>(url + endpoint, tag);
  return response;
};
export const editTag = async (id: string, newTag: Tag) => {
  const response = await post<ValiuResponse<Tag>>(
    url + endpoint + '/' + id,
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
