import * as React from 'react';
import {CustomMasker} from '../utils/CustomMasker';
// credits: https://kentcdodds.com/blog/how-to-use-react-context-effectively

export enum ActionTypes {
  INSERT_NUMBER = 'INSERT_NUMBER',
  INSERT_COMMA = 'INSERT_COMMA',
  DELETE = 'DELETE',
}

type Action = {type: ActionTypes; payload: any};
type Dispatch = (action: Action) => void;
type State = string;
type NumpadProviderProps = {children: React.ReactNode};

const initialState: State = '';

const NumpadStateContext = React.createContext<State | undefined>(undefined);
const NumpadDispatchContext = React.createContext<Dispatch | undefined>(
  undefined,
);
const masker = new CustomMasker();

const handleInsert = (digit: string, prevState: State) => {
  const _number = masker.unmask(prevState + digit);
  const _mask = masker.mask(_number);
  return _mask;
};
const handleDelete = (prevState: State) => {
  if (!prevState) {
    return '';
  }
  if (prevState.includes(',')) {
    return prevState.slice(0, -1);
  }
  const _number = masker.unmask(prevState.slice(0, -1));
  const _mask = masker.mask(_number);
  return _mask;
};

const handleComma = (prevState: State) => {
  if (!prevState) {
    return '';
  }
  if (prevState.slice(-1) === ',') {
    return prevState;
  }
  return prevState + ',';
};

export const reducer: React.Reducer<State, Action> = (state, action) => {
  switch (action.type) {
    case ActionTypes.INSERT_NUMBER:
      return handleInsert(action.payload, state);
    case ActionTypes.INSERT_COMMA:
      return handleComma(state);
    case ActionTypes.DELETE:
      return handleDelete(state);
    default:
      return state;
  }
};

export function useNumpadState() {
  const context = React.useContext(NumpadStateContext);
  if (context === undefined) {
    throw new Error('useNumpadState must be used within a NumpadProvider');
  }
  return context;
}

export function useNumpadDispatch() {
  const context = React.useContext(NumpadDispatchContext);
  if (context === undefined) {
    throw new Error('useNumpadDispatch must be used within a NumpadProvider');
  }
  return context;
}

export const NumpadProvider: React.FC<NumpadProviderProps> = ({children}) => {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  return (
    <NumpadStateContext.Provider value={state}>
      <NumpadDispatchContext.Provider value={dispatch}>
        {children}
      </NumpadDispatchContext.Provider>
    </NumpadStateContext.Provider>
  );
};
