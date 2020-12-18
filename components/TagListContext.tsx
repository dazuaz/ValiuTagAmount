import React, {
  useEffect,
  useReducer,
  useMemo,
  Reducer,
  createContext,
  useContext,
} from 'react';
import {SocketService} from '../utils/SocketService';
import {Tag} from '../types';

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
  REPLACE_TAG = 'REPLACE_TAG',
  REMOVE_TAG = 'REMOVE_TAG',
  RESET_TAGS = 'RESET_TAGS',
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
const TagListStateContext = createContext<ServiceState | undefined>(undefined);
const TagListDispatchContext = createContext<Dispatch | undefined>(undefined);
export const reducer: Reducer<ServiceState, ServiceAction> = (
  state,
  action,
) => {
  switch (action.type) {
    case 'UPDATE_STATUS':
      return {...state, status: action.payload};
    case 'SET_REFRESHING':
      return {...state, refreshing: action.payload};
    case 'ADD_TAG':
      return {
        ...state,
        tags: [action.payload, ...state.tags],
      };
    case 'REPLACE_TAG':
      return {
        ...state,
        tags: state.tags.map((ele) =>
          ele._id === action.payload._id ? action.payload : ele,
        ),
        lastReplacedId: action.payload._id,
      };
    case 'REMOVE_TAG':
      const removeAt = state.tags.findIndex(
        (ele) => ele._id === action.payload,
      );
      if (removeAt !== -1) {
        return {
          ...state,
          tags: [
            ...state.tags.slice(0, removeAt),
            ...state.tags.slice(removeAt + 1),
          ],
        };
      } else {
        return {...state};
      }
    case 'RESET_TAGS':
      return {...state, tags: action.payload, status: Status.Loaded};
    default:
      return state;
  }
};

export function useTagListState() {
  const context = useContext(TagListStateContext);
  if (context === undefined) {
    throw new Error('useTagListState must be used within a TagListProvider');
  }
  return context;
}

export function useTagListDispatch() {
  const context = useContext(TagListDispatchContext);
  if (context === undefined) {
    throw new Error('useTagListDispatch must be used within a TagListProvider');
  }
  return context;
}

export const TagListProvider: React.FC<TagListProviderProps> = ({children}) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  // subscribes to the sockets service observers.
  const service = useMemo(() => new SocketService(), []);

  useEffect(() => {
    service.init();
    console.log('subscribed to services');
    service.onAddTag().subscribe((t: Tag) => {
      dispatch({type: 'ADD_TAG', payload: t});
    });
    service.onModifyTag().subscribe((t: Tag) => {
      dispatch({type: 'REPLACE_TAG', payload: t});
    });
    service.onRemoveTag().subscribe((id: string) => {
      dispatch({type: 'REMOVE_TAG', payload: id});
    });
    return () => {
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
