import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
  Action,
  AnyAction,
  EntityState,
} from '@reduxjs/toolkit';
import {getAllTags, addTag as addTagApi} from '../../api/tagListApi';
import {RootState} from '../../store';

export const tagsAdapter = createEntityAdapter<Tag>({
  selectId: (tag) => tag._id,
  sortComparer: (a, b) => b._id.localeCompare(a._id),
});

export enum Status {
  Idle = 'idle',
  Loading = 'loading',
  Loaded = 'loaded',
  Error = 'error',
}

interface RejectedAction extends Action {
  error: Error;
}
interface TagsState {
  tags: EntityState<Tag> & {
    status: Status;
    lastReplacedId: string;
  };
}

function isRejectedAction(action: AnyAction): action is RejectedAction {
  return action.type.endsWith('rejected');
}

export const initialTags = tagsAdapter.getInitialState({
  status: Status.Idle,
  lastReplacedId: '',
});

export const fetchTags = createAsyncThunk('tags/fetchTags', async () => {
  const response = await getAllTags();
  return response.data;
});

// export const handleModifyTag = createAsyncThunk(
//   'tags/handleModifyTag',
//   async (data: {tag: Tag; title: string}) => {
//     return modifyTag(data.tag, data.title);
//   },
// );

export const tagsSlice = createSlice({
  name: 'tags',
  initialState: initialTags,
  reducers: {
    addTag: tagsAdapter.addOne,
    updateTag: tagsAdapter.updateOne,
    removeTag: tagsAdapter.removeOne,
  },
  extraReducers: (builder) => {
    builder.addCase(fetchTags.pending, (state) => {
      state.status = Status.Loading;
    });
    builder.addCase(fetchTags.fulfilled, (state, action) => {
      state.status = Status.Loaded;
      tagsAdapter.upsertMany(state, action);
    });
    builder.addMatcher(isRejectedAction, (state) => {
      state.status = Status.Error;
    });
  },
});

export const {addTag, updateTag, removeTag} = tagsSlice.actions;

export const {
  selectAll: selectTags,
  selectTotal: selectTagsTotal,
  selectById: selectTagById,
} = tagsAdapter.getSelectors<RootState>((state) => state.tags);

export const selectStatus = (state: TagsState) => state.tags.status;
export const selectLastReplacedId = (state: TagsState) =>
  state.tags.lastReplacedId;

export default tagsSlice.reducer;
