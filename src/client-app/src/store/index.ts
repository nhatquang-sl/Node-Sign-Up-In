import { applyMiddleware, createStore, combineReducers } from 'redux';
import logger from 'redux-logger';
import thunk from 'redux-thunk';
import promiseMiddleware from 'redux-promise-middleware';

import settings from './settings/reducer';
import auth from './auth/reducer';
import snackbar from './snackbar/reducer';

// Combine Reducers
var reducer = combineReducers({ settings, auth, snackbar });

let middleWare = applyMiddleware(promiseMiddleware, logger, thunk);
// middleWare = applyMiddleware(promiseMiddleware, thunk);
const store = createStore(reducer, middleWare);

export default store;
