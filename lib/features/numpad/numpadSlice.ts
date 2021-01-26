import {createSlice} from '@reduxjs/toolkit';
import {CustomMasker} from '../../utils/CustomMasker';

const masker = new CustomMasker();

export const numpadSlice = createSlice({
  name: 'numpad',
  initialState: {
    value: '',
  },
  reducers: {
    insertDigit: (state, action) => {
      const _number = masker.unmask(state.value + action.payload);
      const _mask = masker.mask(_number);
      state.value = _mask;
    },
    insertComma: (state) => {
      if (state.value) {
        if (state.value.search(',') === -1) {
          state.value = state.value + ',';
        }
      }
    },
    deleteChar: (state) => {
      if (state.value) {
        if (state.value.includes(',')) {
          state.value.slice(0, -1);
        }
        const _number = masker.unmask(state.value.slice(0, -1));
        const _mask = masker.mask(_number);
        state.value = _mask;
      }
    },
    replaceNumpad: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const {
  insertDigit,
  insertComma,
  deleteChar,
  replaceNumpad,
} = numpadSlice.actions;

export const selectNumpad = (state: {numpad: {value: string}}) =>
  state.numpad.value;

export default numpadSlice.reducer;
