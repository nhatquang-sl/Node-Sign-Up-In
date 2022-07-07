import { applyMiddleware, createStore, combineReducers } from 'redux';
import logger from 'redux-logger';
import thunk from 'redux-thunk';
import promiseMiddleware from 'redux-promise-middleware';
import axios, { AxiosRequestConfig, AxiosError } from 'axios';

import settings from './settings/reducer';
import auth from './auth/reducer';
import user from './user/reducer';
import snackbar from './snackbar/reducer';
import global from './global/reducer';
import { showSnackbar } from './snackbar/actions';
import { logOut } from './auth/actions';
import { errNetwork } from './global/actions';

// Combine Reducers
var reducer = combineReducers({ settings, auth, user, snackbar, global });

let middleWare = applyMiddleware(promiseMiddleware, logger, thunk);
// middleWare = applyMiddleware(promiseMiddleware, thunk);
const store = createStore(reducer, middleWare);

axios.interceptors.request.use((config: AxiosRequestConfig<any>) => {
  if (config && config.headers && localStorage.auth) {
    const auth = JSON.parse(localStorage.auth);
    config.headers.Authorization = `Bearer ${auth.accessToken}`;
  }
  return config;
});

axios.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error: AxiosError) {
    if (error.code === 'ERR_NETWORK') {
      store.dispatch(showSnackbar(error.message, 'error'));
      store.dispatch(errNetwork());
    } else if (store.getState().global.errNetwork) store.dispatch(errNetwork(false));

    if (error.response?.status === 401) store.dispatch(logOut());
    console.log(error.response);
    return Promise.reject(error);
  }
);
export default store;
