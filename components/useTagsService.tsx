import {useEffect, useReducer} from 'react';
import {SocketService} from '../utils/SocketService';
import {Tag} from '../types';
import {getAllTags} from '../utils/TagsApi';

interface ServiceState {
  tags: Tag[];
  isLoading: boolean;
}
interface ServiceAction {
  payload: any;
  type: string;
}

type Reducer<S, A> = (prevState: S, action: A) => S;

const useTagsService = () => {
  const initialState: ServiceState = {
    tags: [],
    isLoading: false,
  };
  const reducer: Reducer<ServiceState, ServiceAction> = (state, action) => {
    switch (action.type) {
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
        return {...state, tags: action.payload};
      default:
        return state;
    }
  };
  const [state, dispatch] = useReducer(reducer, initialState);

  // Subscribe to socket events
  const service = new SocketService();
  useEffect(() => {
    const initialLoad = async () => {
      // const result = await fetch('http://localhost:3000/api/tags');
      // const json = await result.json();
      const result = await getAllTags();
      // console.log(json.data);
      dispatch({type: 'RESET_TAGS', payload: result.parsedBody?.data});
    };
    initialLoad();
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
  }, []);

  return {state, dispatch};
};

export default useTagsService;
