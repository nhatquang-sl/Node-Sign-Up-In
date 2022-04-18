import { Reducer } from 'redux';
import cloneDeep from 'lodash/cloneDeep';

import { AUTH_TYPE, AuthState } from './types';

const initialState: AuthState = new AuthState();

const reducer: Reducer<AuthState> = (state = initialState, action) => {
  const newState: AuthState = cloneDeep(state);

  switch (action.type) {
    case `${AUTH_TYPE.SIGN_UP}_PENDING`:
    case `${AUTH_TYPE.SIGN_IN}_PENDING`:
      newState.errors = {};
      newState.pendingTypes.push(action.type.replace('_PENDING', ''));
      break;
    case `${AUTH_TYPE.SIGN_UP}_FULFILLED`:
      newState.accessToken = action.payload.data.accessToken;
      newState.firstName = action.payload.data.accessToken;
      newState.lastName = action.payload.data.lastName;
      newState.emailAddress = action.payload.data.emailAddress;
      newState.emailConfirmed = action.payload.data.emailConfirmed;
      newState.removePending(action.type.replace('_FULFILLED', ''));
      break;
    case `${AUTH_TYPE.SIGN_IN}_FULFILLED`:
      break;
    case `${AUTH_TYPE.SIGN_UP}_REJECTED`:
      if (action.payload.response.status == 409) {
        newState.errors['emailAddress'] = [];
        newState.errors['emailAddress'].push('Duplicated email address!');
      }
      newState.removePending(action.type.replace('_REJECTED', ''));
      break;
    case `${AUTH_TYPE.SIGN_IN}_REJECTED`:
      newState.removePending(action.type.replace('_REJECTED', ''));
      break;
    default:
  }
  return newState;
};

export default reducer;
