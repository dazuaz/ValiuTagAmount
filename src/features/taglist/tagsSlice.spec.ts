import tags, {addTag, updateTag, removeTag, initialTags} from './tagsSlice';

const firstTag: Tag = {
  _id: '6008fcb74c84db7947dbc855',
  color: 'blue',
  created_at: '2021-01-21T04:01:59.825Z',
  title: '320020',
  updated_at: '2021-01-21T04:01:59.825Z',
};

const secondTag: Tag = {
  _id: '6008fd724c84db7947dbc856',
  color: 'red',
  created_at: '2021-01-21T04:05:06.570Z',
  title: '820020',
  updated_at: '2021-01-21T04:05:06.570Z',
};

describe('tags reducer', () => {
  it('should handle initial state', () => {
    expect(tags(undefined, {type: ''})).toEqual(initialTags);
  });

  const oneTag = tags(initialTags, addTag(firstTag));
  const twoTags = tags(oneTag, addTag(secondTag));
  const sameTag = tags(oneTag, addTag(firstTag));

  describe('should handle ADD_TAG', () => {
    it('Adds a tag at the beggining of the array', () => {
      expect(oneTag.ids).toEqual([firstTag._id]);
    });
    it('Adds another tag at the beggining of not and empty array', () => {
      expect(twoTags.ids).toHaveLength(2);
      expect(twoTags.ids[0]).toEqual(secondTag._id);
      expect(twoTags.ids[1]).toEqual(firstTag._id);
    });
    it('Can not add same tag again', () => {
      expect(sameTag.ids).toHaveLength(1);
    });
  });

  describe('should handle REMOVE_TAG', () => {
    const removeFist = tags(twoTags, removeTag(firstTag._id));
    it('Removes a tag', () => {
      expect(removeFist.ids).toEqual([secondTag._id]);
    });
  });

  describe('should hanlde UPDATE_TAG', () => {
    const updateFirst = tags(
      twoTags,
      updateTag({id: firstTag._id, changes: {color: 'yellow'}}),
    );
    it('Edits a tag giving by extracting its ID', () => {
      expect(updateFirst.entities[firstTag._id]?.color).toEqual('yellow');
    });
  });
});
