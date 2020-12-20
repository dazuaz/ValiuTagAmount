import * as React from 'react';
import {SocketService} from '../utils/SocketService';
import produce from 'immer';

export enum Status {
  Idle = 'idle',
  Loading = 'loading',
  Loaded = 'loaded',
  Error = 'error',
}
export enum ActionTypes {
  UPDATE_STATUS = 'UPDATE_STATUS',
  SET_REFRESHING = 'SET_REFRESHING',
  ADD_TAG = 'ADD_TAG',
  ADD_TAG_SAFE = 'ADD_TAG_SAFE',
  MODIFY_TAG = 'MODIFY_TAG',
  REMOVE_TAG = 'REMOVE_TAG',
  REMOVE_TAG_BY_ID = 'REMOVE_TAG_BY_ID',
  RESET_TAGS = 'RESET_TAGS',
  RESTORE_TAG = 'RESTORE_TAG',
}
export type ServiceState = {
  tags: Tag[];
  status: Status;
  lastReplacedId: string;
  refreshing: boolean;
};
type ServiceAction = {payload: any; type: string};
type Dispatch = (action: ServiceAction) => void;
type TagListProviderProps = {children: React.ReactNode};

export const initialState: ServiceState = {
  tags: [],
  status: Status.Idle,
  lastReplacedId: '',
  refreshing: false,
};
const TagListStateContext = React.createContext<ServiceState | undefined>(
  undefined,
);
const TagListDispatchContext = React.createContext<Dispatch | undefined>(
  undefined,
);
export const reducer: React.Reducer<ServiceState, ServiceAction> = (
  state,
  action,
) => {
  // https://immerjs.github.io/immer/docs/update-patterns
  switch (action.type) {
    case 'UPDATE_STATUS':
      return {...state, status: action.payload};
    case 'SET_REFRESHING':
      return {...state, refreshing: action.payload};
    case 'ADD_TAG':
      return produce(state, (draft) => {
        draft.lastReplacedId = action.payload._id;
        draft.tags.unshift(action.payload);
      });
    case 'ADD_TAG_SAFE':
      return produce(state, (draft) => {
        const index = draft.tags.findIndex(
          (tag) => tag._id === action.payload._id,
        );
        if (index !== -1) {
          draft.lastReplacedId = action.payload._id;
          draft.tags.unshift(action.payload);
        }
      });
    case 'MODIFY_TAG':
      return produce(state, (draft) => {
        const index = draft.tags.findIndex(
          (tag) => tag._id === action.payload._id,
        );
        if (index !== -1) {
          draft.lastReplacedId = action.payload._id;
          draft.tags[index].title = action.payload.title;
          draft.tags[index].color = action.payload.color;
        }
      });
    case 'REMOVE_TAG':
      return produce(state, (draft) => {
        draft.tags.splice(action.payload, 1);
      });
    case 'REMOVE_TAG_BY_ID':
      return produce(state, (draft) => {
        const index = draft.tags.findIndex((tag) => tag._id === action.payload);
        if (index !== -1) {
          draft.tags.splice(index, 1);
        }
      });
    case 'RESTORE_TAG':
      return produce(state, (draft) => {
        draft.tags.splice(action.payload.index, 0, action.payload.tag);
      });

    case 'RESET_TAGS':
      return {...state, tags: action.payload, status: Status.Loaded};
    default:
      return {...state};
  }
};

export function useTagListState() {
  const context = React.useContext(TagListStateContext);
  if (context === undefined) {
    throw new Error('useTagListState must be used within a TagListProvider');
  }
  return context;
}

export function useTagListDispatch() {
  const context = React.useContext(TagListDispatchContext);
  if (context === undefined) {
    throw new Error('useTagListDispatch must be used within a TagListProvider');
  }
  return context;
}

export const TagListProvider: React.FC<TagListProviderProps> = ({children}) => {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  // subscribes to the sockets service observers.
  const service = React.useMemo(() => new SocketService(), []);

  React.useEffect(() => {
    service.init();
    const onAddSub = service.onAddTag().subscribe((t: Tag) => {
      dispatch({type: 'ADD_TAG_SAFE', payload: t});
    });
    const onModSub = service.onModifyTag().subscribe((t: Tag) => {
      dispatch({type: 'MODIFY_TAG', payload: t});
    });
    const onRemSub = service.onRemoveTag().subscribe((id: string) => {
      dispatch({type: 'REMOVE_TAG_BY_ID', payload: id});
    });
    return () => {
      onAddSub.unsubscribe();
      onModSub.unsubscribe();
      onRemSub.unsubscribe();
      service.disconnect();
    };
  }, [service]);

  return (
    <TagListStateContext.Provider value={state}>
      <TagListDispatchContext.Provider value={dispatch}>
        {children}
      </TagListDispatchContext.Provider>
    </TagListStateContext.Provider>
  );
};
