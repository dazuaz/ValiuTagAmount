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

const tag: Tag = {
  _id: '5fdc22180a56315d16b4f704',
  color: 'green',
  title: '20000',
};
const snapshot: ServiceState = {
  ...initialState,
  lastReplacedId: tag._id,
  tags: [tag],
};
const twoTags = [
  {...tag, _id: uniqueID() + ''},
  {...tag, _id: uniqueID() + ''},
];
const threeTags = [
  {...tag, _id: uniqueID() + ''},
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
  tags: [...twoTags, tag, ...threeTags],
};
const snapshotMultipleDeleted: ServiceState = {
  ...initialState,
  status: Status.Loaded,
  tags: [...twoTags, ...threeTags],
};
const snapshotMultipleEdited: ServiceState = {
  ...initialState,
  status: Status.Loaded,
  lastReplacedId: editedTag._id,
  tags: [...twoTags, editedTag, ...threeTags],
};
const snapshotMultipleReplaced: ServiceState = {
  ...initialState,
  status: Status.Loaded,
  tags: [...twoTags, editedTag, ...threeTags],
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

    it('Removes a tag giving its Index', () => {
      expect(removeTag(snapshotMultiple, '2')).toEqual(snapshotMultipleDeleted);
    });
  });
  describe(ActionTypes.REMOVE_TAG_BY_ID, () => {
    const removeTag = (prevState: ServiceState, payload: string) =>
      reducer(prevState, {type: ActionTypes.REMOVE_TAG_BY_ID, payload});

    it('Removes a tag giving its Tag id', () => {
      expect(removeTag(snapshotMultiple, '5fdc22180a56315d16b4f704')).toEqual(
        snapshotMultipleDeleted,
      );
    });
  });

  describe(ActionTypes.MODIFY_TAG, () => {
    const modifyTag = (prevState: ServiceState, payload: Tag) =>
      reducer(prevState, {type: ActionTypes.MODIFY_TAG, payload});
    it('Edits a tag giving by extracting its ID', () => {
      expect(modifyTag(snapshotMultiple, editedTag)).toEqual(
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
  describe(ActionTypes.RESTORE_TAG, () => {
    const restoreTag = (
      prevState: ServiceState,
      payload: {tag: Tag; index: string},
    ) => reducer(prevState, {type: ActionTypes.RESTORE_TAG, payload});
    it('Restores a tag at the given index', () => {
      expect(
        restoreTag(snapshotMultipleDeleted, {tag: tag, index: '2'}),
      ).toEqual(snapshotMultiple);
    });
  });
});
