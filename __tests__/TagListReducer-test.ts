/**
 * @format
 */
import {
  ActionTypes,
  reducer as TagListReducer,
  ServiceState,
} from '../components/TagListContext';
import produce from 'immer';
const reducer = produce(TagListReducer);

const initialState: Tag[] = [];
const tag: Tag = {
  _id: '5fdc22180a56315d16b4f704',
  color: 'green',
  title: '20000',
};
function uniqueID() {
  return Math.floor(Math.random() * Date.now());
}
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
const snapshot: ServiceState = [tag];
const snapshotMultiple: ServiceState = [...twoTags, tag, ...threeTags];
const snapshotMultipleDeleted: ServiceState = [...twoTags, ...threeTags];
const snapshotMultipleEdited: ServiceState = [
  ...twoTags,
  editedTag,
  ...threeTags,
];

const snapshotMultipleReplaced: ServiceState = [
  ...twoTags,
  editedTag,
  ...threeTags,
];

describe('tagList reducer', () => {
  describe(ActionTypes.ADD_TAG, () => {
    const addTag = (draft: ServiceState, payload: any) =>
      reducer(draft, {type: ActionTypes.ADD_TAG, payload});
    it('Adds a tag at the beggining of the array', () => {
      expect(addTag(initialState, tag)).toEqual([tag]);
    });
    it('Adds another tag at the beggining of not and empty array', () => {
      expect(addTag(addTag(initialState, tag), tag)).toEqual(
        addTag(snapshot, tag),
      );
    });
  });
  describe(ActionTypes.ADD_TAG_SAFE, () => {
    const addTagSafe = (draft: ServiceState, payload: any) =>
      reducer(draft, {type: ActionTypes.ADD_TAG_SAFE, payload});
    it('Adds a tag at the beggining of the array', () => {
      expect(addTagSafe(initialState, tag)).toEqual([tag]);
    });
    it('Adds another tag at the beggining of not and empty array', () => {
      expect(addTagSafe(addTagSafe(initialState, tag), tag)).toEqual(
        addTagSafe(snapshot, tag),
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
    it('Replaces state with a new set tags', () => {
      expect(resetTags(snapshotMultiple, snapshotMultipleEdited)).toEqual(
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
