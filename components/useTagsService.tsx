import {useEffect, useReducer, useMemo} from 'react';
import {SocketService} from '../utils/SocketService';
import {Tag} from '../types';

export enum Status {
  Idle = 'idle',
  Loading = 'loading',
  Loaded = 'loaded',
  Error = 'error',
}
interface ServiceState {
  tags: Tag[];
  status: Status;
}
interface ServiceAction {
  payload: any;
  type: string;
}
type Reducer<S, A> = (prevState: S, action: A) => S;

/**
 * useTagsService hook
 *
 * It calls the useReducer hook to
 */
const useTagsService = () => {
  const initialState: ServiceState = {
    tags: [],
    status: Status.Idle,
  };
  const reducer: Reducer<ServiceState, ServiceAction> = (state, action) => {
    switch (action.type) {
      case 'UPDATE_STATUS':
        return {...state, status: action.payload};
      case 'ADD_TAG':
        return {...state, tags: [action.payload, ...state.tags]};
      case 'REPLACE_TAG':
        return {
          ...state,
          tags: state.tags.map((ele) =>
            ele._id === action.payload._id ? action.payload : ele,
          ),
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
  const [state, dispatch] = useReducer(reducer, initialState);

  // Subscribe to socket events
  const service = useMemo(() => new SocketService(), []);
  useEffect(() => {
    service.init();
    // TODO use memoized callbacks
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
      console.log('disconnect');
      service.disconnect();
    };
  }, [service]);

  return {state, dispatch};
};

export default useTagsService;
