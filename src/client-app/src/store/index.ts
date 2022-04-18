import { applyMiddleware, createStore, combineReducers } from 'redux';
import logger from 'redux-logger';
import thunk from 'redux-thunk';
import promiseMiddleware from 'redux-promise-middleware';
import axios, { AxiosRequestConfig } from 'axios';

import settings from './settings/reducer';
import auth from './auth/reducer';
import snackbar from './snackbar/reducer';

// Combine Reducers
var reducer = combineReducers({ settings, auth, snackbar });

let middleWare = applyMiddleware(promiseMiddleware, logger, thunk);
// middleWare = applyMiddleware(promiseMiddleware, thunk);
const store = createStore(reducer, middleWare);

axios.interceptors.request.use((config: AxiosRequestConfig<any>) => {
  const auth = JSON.parse(localStorage.auth);

  if (config && config.headers && auth.accessToken)
    config.headers.Authorization = `Bearer ${auth.accessToken}`;
  return config;
});
export default store;
