import * as React from 'react';

export enum Status {
  Idle = 'idle',
  Loading = 'loading',
  Loaded = 'loaded',
  Error = 'error',
}
export enum ActionTypes {
  UPDATE_STATUS = 'UPDATE_STATUS',
  SET_REFRESHING = 'SET_REFRESHING',
  SET_REPlACED = 'SET_REPlACED',
}
export type ServiceState = {
  status: Status;
  lastReplacedId: string;
  refreshing: boolean;
};
type ServiceAction = {payload: any; type: ActionTypes};
export type Dispatch = (action: ServiceAction) => void;

export const initialState: ServiceState = {
  status: Status.Idle,
  lastReplacedId: '',
  refreshing: false,
};
const GlobalStateContext = React.createContext<ServiceState | undefined>(
  undefined,
);
const GlobalDispatchContext = React.createContext<Dispatch | undefined>(
  undefined,
);
export const reducer = (state: ServiceState, action: ServiceAction) => {
  switch (action.type) {
    case 'UPDATE_STATUS':
      return {...state, status: action.payload};
    case 'SET_REFRESHING':
      return {...state, refreshing: action.payload};
    case 'SET_REPlACED':
      return {...state, lastReplacedId: action.payload};
    default:
      return {...state};
  }
};

export function useGlobalState() {
  const context = React.useContext(GlobalStateContext);
  if (context === undefined) {
    throw new Error('useGlobalState must be used within a GlobalProvider');
  }
  return context;
}

export function useGlobalDispatch() {
  const context = React.useContext(GlobalDispatchContext);
  if (context === undefined) {
    throw new Error('useGlobalDispatch must be used within a GlobalProvider');
  }
  return context;
}

export const GlobalProvider: React.FC = ({children}) => {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  return (
    <GlobalStateContext.Provider value={state}>
      <GlobalDispatchContext.Provider value={dispatch}>
        {children}
      </GlobalDispatchContext.Provider>
    </GlobalStateContext.Provider>
  );
};
