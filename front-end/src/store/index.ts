import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './counter-slice';
import settingsSlice from './settings-slice';
import authSlice from './auth-slice';
import snackbarSlice from './snackbar-slice';
import usersSlice from './users-slice';

const store = configureStore({
  reducer: {
    counter: counterReducer,
    settings: settingsSlice,
    auth: authSlice,
    snackbar: snackbarSlice,
    users: usersSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
