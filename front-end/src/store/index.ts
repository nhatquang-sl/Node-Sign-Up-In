import { appApi } from 'store/app-api';
import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './counter-slice';
import settingsSlice from './settings-slice';
import authReducer from './auth-slice';
import snackbarSlice from './snackbar-slice';
import sessionsReducer from './sessions-slice';

const store = configureStore({
  reducer: {
    counter: counterReducer,
    settings: settingsSlice,
    auth: authReducer,
    snackbar: snackbarSlice,
    sessions: sessionsReducer,
    [appApi.reducerPath]: appApi.reducer,
  },
  // Adding the api middleware enables caching, invalidation, polling,
  // and other useful features of `rtk-query`.
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({}).concat([appApi.middleware]),
  devTools: process.env.NODE_ENV === 'development',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
