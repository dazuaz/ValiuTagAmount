import {configureStore} from '@reduxjs/toolkit';

import numpadReducer from './features/numpad/numpadSlice';
import tagsReducer from './features/taglist/tagsSlice';

const store = configureStore({
  reducer: {
    numpad: numpadReducer,
    tags: tagsReducer,
  },
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
