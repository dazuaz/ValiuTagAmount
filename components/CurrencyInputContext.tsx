import * as React from 'react';
import {CustomMasker} from '../utils/CustomMasker';
// credits: https://kentcdodds.com/blog/how-to-use-react-context-effectively
export enum ActionTypes {
  UPDATE_MASK = 'UPDATE_MASK',
  INSERT_NUMBER = 'INSERT_NUMBER',
  INSERT_COMMA = 'INSERT_COMMA',
  DELETE = 'DELETE',
  UPDATE_SELECTION = 'UPDATE_SELECTION',
}
type Selection = {start: number; end: number};
type Action = {type: ActionTypes; payload: any};
type Dispatch = (action: Action) => void;
type State = {maskedValue: string; selection: Selection};
type CurrencyProviderProps = {children: React.ReactNode};

const initialState: State = {
  maskedValue: '',
  selection: {start: 0, end: 0},
};

const CurrencyStateContext = React.createContext<State | undefined>(undefined);
const CurrencyDispatchContext = React.createContext<Dispatch | undefined>(
  undefined,
);
const masker = new CustomMasker();

const reducer: React.Reducer<State, Action> = (state, action) => {
  const handleChangeText = (masked: string) => {
    if (!masked) {
      return '';
    }
    const _number = masker.unmask(masked);
    const _mask = masker.mask(_number);
    // Decimals are handled separatly since the formatter would not allow a naked comma
    const _decimals = masker.decimals(masked);
    return _mask + _decimals;
  };

  const handleDelete = () => {
    let start: number = state.selection.start;
    let end: number = state.selection.end;
    const value: string = state.maskedValue;

    if (value) {
      let before = value.slice(0, start);
      let after = state.maskedValue.slice(end);
      console.log(before + after);
      // value = before + after;
    }

    return {cursorAt: start, masked: value};
  };

  const insertNumber = (digit: number) => {
    let cursorAt: number = state.selection.end;
    let value: string = state.maskedValue;
    if (cursorAt !== 0) {
      // is not a selection
      if (state.selection.start === state.selection.end) {
        // no selection but it is at the end
        if (cursorAt === value.length) {
          value = state.maskedValue + digit;
        } else {
          // no selection at breakpoint
          let start = state.maskedValue.slice(0, cursorAt);
          let end = state.maskedValue.slice(cursorAt);
          value = start + digit + end;
        }
      } else {
        // SELECTION
        let start = state.maskedValue.slice(0, state.selection.start);
        let end = state.maskedValue.slice(state.selection.end);
        value = start + digit + end;
      }
    } else {
      // no cursor
      value = state.maskedValue + digit;
    }

    const masked = handleChangeText(value);
    // masked value can change more than 1 in lenght when format changes 1000 -> 1000
    cursorAt = cursorAt + (masked.length - state.maskedValue.length ?? 0);
    console.log('*****');
    console.log(digit);
    console.log(cursorAt);
    console.log(masked);

    return {insertAt: cursorAt, insertMasked: masked};
  };

  switch (action.type) {
    case 'UPDATE_MASK':
      return {...state, maskedValue: handleChangeText(action.payload)};
    case 'INSERT_NUMBER':
      const {insertAt, insertMasked} = insertNumber(action.payload);
      return {
        ...state,
        maskedValue: insertMasked,
        selection: {start: insertAt, end: insertAt},
      };
    case 'DELETE':
      const {cursorAt, masked} = handleDelete();
      return {
        ...state,
        maskedValue: masked,
        selection: {start: cursorAt, end: cursorAt},
      };
    case 'INSERT_COMMA':
      return {...state, maskedValue: action.payload};
    case 'UPDATE_SELECTION':
      console.log(action.payload);
      return {...state, selection: action.payload};
    default:
      return state;
  }
};

export function useCurrencyState() {
  const context = React.useContext(CurrencyStateContext);
  if (context === undefined) {
    throw new Error('useCountState must be used within a CountProvider');
  }
  return context;
}

export function useCurrencyDispatch() {
  const context = React.useContext(CurrencyDispatchContext);
  if (context === undefined) {
    throw new Error('useCountDispatch must be used within a CountProvider');
  }
  return context;
}

export const CurrencyInputProvider: React.FC<CurrencyProviderProps> = ({
  children,
}) => {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  return (
    <CurrencyStateContext.Provider value={state}>
      <CurrencyDispatchContext.Provider value={dispatch}>
        {children}
      </CurrencyDispatchContext.Provider>
    </CurrencyStateContext.Provider>
  );
};
