import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './counter-slice';
import settingsSlice from './settings-slice';

const store = configureStore({
  reducer: {
    counter: counterReducer,
    settings: settingsSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export default store;
