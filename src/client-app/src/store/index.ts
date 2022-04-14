import { applyMiddleware, createStore, combineReducers } from 'redux';
import logger from 'redux-logger';
import thunk from 'redux-thunk';
import promiseMiddleware from 'redux-promise-middleware';

import settings from './settings/reducer';

// Combine Reducers
var reducer = combineReducers({ settings });

let middleWare = applyMiddleware(promiseMiddleware, logger, thunk);
middleWare = applyMiddleware(promiseMiddleware, thunk);
const store = createStore(reducer, middleWare);

export default store;
