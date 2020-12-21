import * as React from 'react';
import {useImmerReducer} from 'use-immer';

export enum ActionTypes {
  ADD_TAG = 'ADD_TAG',
  ADD_TAG_SAFE = 'ADD_TAG_SAFE',
  MODIFY_TAG = 'MODIFY_TAG',
  REMOVE_TAG = 'REMOVE_TAG',
  REMOVE_TAG_BY_ID = 'REMOVE_TAG_BY_ID',
  RESET_TAGS = 'RESET_TAGS',
  RESTORE_TAG = 'RESTORE_TAG',
}
export type Dispatch = (action: ServiceAction) => void;
type ServiceAction = {payload: any; type: ActionTypes};

export type ServiceState = Tag[];
export const initialState: ServiceState = [];

const TagListStateContext = React.createContext<ServiceState | undefined>(
  undefined,
);
const TagListDispatchContext = React.createContext<Dispatch | undefined>(
  undefined,
);
export const reducer = (draft: ServiceState, action: ServiceAction) => {
  // https://immerjs.github.io/immer/docs/update-patterns
  switch (action.type) {
    case ActionTypes.ADD_TAG:
      draft.unshift(action.payload);
      break;
    case ActionTypes.ADD_TAG_SAFE: {
      const index = draft.findIndex((tag) => tag._id === action.payload._id);
      if (index === -1) {
        draft.unshift(action.payload);
      }
      break;
    }
    case ActionTypes.MODIFY_TAG: {
      const index = draft.findIndex((tag) => tag._id === action.payload._id);
      if (index !== -1) {
        draft[index].title = action.payload.title;
        draft[index].color = action.payload.color;
      }
      break;
    }
    case ActionTypes.REMOVE_TAG:
      draft.splice(action.payload, 1);
      break;
    case ActionTypes.REMOVE_TAG_BY_ID: {
      const index = draft.findIndex((tag) => tag._id === action.payload);
      if (index !== -1) {
        draft.splice(index, 1);
      }
      break;
    }
    case ActionTypes.RESTORE_TAG:
      draft.splice(action.payload.index, 0, action.payload.tag);
      break;
    case ActionTypes.RESET_TAGS:
      return action.payload;
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

export const TagListProvider: React.FC = ({children}) => {
  const [state, dispatch] = useImmerReducer(reducer, initialState);
  // subscribes to the sockets service observers.

  return (
    <TagListStateContext.Provider value={state}>
      <TagListDispatchContext.Provider value={dispatch}>
        {children}
      </TagListDispatchContext.Provider>
    </TagListStateContext.Provider>
  );
};
