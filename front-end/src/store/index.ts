import { applyMiddleware, createStore, combineReducers } from 'redux';
import logger from 'redux-logger';
import thunk from 'redux-thunk';
import promiseMiddleware from 'redux-promise-middleware';
import axios, { AxiosRequestConfig, AxiosError } from 'axios';

import settings from './settings/reducer';
import auth from './auth/reducer';
import snackbar from './snackbar/reducer';
import { showSnackbar } from './snackbar/actions';

// Combine Reducers
var reducer = combineReducers({ settings, auth, snackbar });

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
    if (error.code === 'ERR_NETWORK') store.dispatch(showSnackbar(error.message, 'error'));
    return Promise.reject(error);
  }
);
export default store;
