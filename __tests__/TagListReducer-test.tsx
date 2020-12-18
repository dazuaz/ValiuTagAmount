/**
 * @format
 */

import {
  ActionTypes,
  reducer,
  ServiceState,
  Status,
  initialState,
} from '../components/TagListContext';
import {Tag} from '../types';
// Note: test renderer must be required after react-native.

const tag: Tag = {
  _id: '5fdc22180a56315d16b4f704',
  color: 'green',
  title: '20000',
};
const snapshot: ServiceState = {
  ...initialState,
  tags: [tag],
};
const twoTags = [
  {...tag, _id: uniqueID() + ''},
  {...tag, _id: uniqueID() + ''},
];
const editedTag: Tag = {
  _id: '5fdc22180a56315d16b4f704',
  color: 'blue',
  title: '30000',
};

const snapshotMultiple: ServiceState = {
  ...initialState,
  status: Status.Loaded,
  tags: [...twoTags, tag],
};
const snapshotMultipleDeleted: ServiceState = {
  ...initialState,
  status: Status.Loaded,
  tags: [...twoTags],
};
const snapshotMultipleEdited: ServiceState = {
  ...initialState,
  status: Status.Loaded,
  lastReplacedId: editedTag._id,
  tags: [...twoTags, editedTag],
};
const snapshotMultipleReplaced: ServiceState = {
  ...initialState,
  status: Status.Loaded,
  tags: [...twoTags, editedTag],
};
function uniqueID() {
  return Math.floor(Math.random() * Date.now());
}

describe('tagList reducer', () => {
  describe(ActionTypes.ADD_TAG, () => {
    const addTag = (value: ServiceState, payload: any) =>
      reducer(value, {type: ActionTypes.ADD_TAG, payload});

    it('Adds a tag at the beggining of the array', () => {
      expect(addTag(initialState, tag)).toEqual(snapshot);
    });
    it('Adds another tag at the beggining of not and empty array', () => {
      expect(addTag(addTag(initialState, tag), tag)).toEqual(
        addTag(snapshot, tag),
      );
    });
  });
  describe(ActionTypes.REMOVE_TAG, () => {
    const removeTag = (prevState: ServiceState, payload: string) =>
      reducer(prevState, {type: ActionTypes.REMOVE_TAG, payload});

    it('Removes a tag giving its ID', () => {
      expect(removeTag(snapshotMultiple, tag._id)).toEqual(
        snapshotMultipleDeleted,
      );
    });
  });
  describe(ActionTypes.REPLACE_TAG, () => {
    const replaceTag = (prevState: ServiceState, payload: Tag) =>
      reducer(prevState, {type: ActionTypes.REPLACE_TAG, payload});
    it('Edits a tag giving by extracting its ID', () => {
      expect(replaceTag(snapshotMultiple, editedTag)).toEqual(
        snapshotMultipleEdited,
      );
    });
  });
  describe(ActionTypes.RESET_TAGS, () => {
    const resetTags = (prevState: ServiceState, payload: Tag[]) =>
      reducer(prevState, {type: ActionTypes.RESET_TAGS, payload});
    it('Replaces state with new a new set tags', () => {
      expect(resetTags(snapshotMultiple, snapshotMultipleEdited.tags)).toEqual(
        snapshotMultipleReplaced,
      );
    });
  });
});
