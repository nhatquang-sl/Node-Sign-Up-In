import { Reducer } from 'redux';
import cloneDeep from 'lodash/cloneDeep';

import { AUTH_TYPE, AuthState } from './types';

let initialState: AuthState = new AuthState();
if (localStorage.auth) {
  const localAuth = JSON.parse(localStorage.auth);
  initialState.accessToken = localAuth.accessToken;
  initialState.emailAddress = localAuth.emailAddress;
  initialState.emailConfirmed = localAuth.emailConfirmed;
  initialState.firstName = localAuth.firstName;
  initialState.lastName = localAuth.lastNam;
}

const reducer: Reducer<AuthState> = (state = initialState, action) => {
  const newState: AuthState = cloneDeep(state);

  switch (action.type) {
    case `${AUTH_TYPE.REGISTER}_PENDING`:
    case `${AUTH_TYPE.SIGN_IN}_PENDING`:
      newState.errors = {};
      newState.pendingTypes.push(action.type.replace('_PENDING', ''));
      break;
    case `${AUTH_TYPE.REGISTER}_FULFILLED`:
      newState.accessToken = action.payload.data.accessToken;
      newState.firstName = action.payload.data.accessToken;
      newState.lastName = action.payload.data.lastName;
      newState.emailAddress = action.payload.data.emailAddress;
      newState.emailConfirmed = action.payload.data.emailConfirmed;
      localStorage.auth = JSON.stringify({
        accessToken: newState.accessToken,
        emailAddress: newState.emailAddress,
        emailConfirmed: newState.emailConfirmed,
        firstName: newState.firstName,
        lastName: newState.lastName,
      });
      newState.removePending(action.type.replace('_FULFILLED', ''));
      break;
    case `${AUTH_TYPE.SIGN_IN}_FULFILLED`:
      break;
    case `${AUTH_TYPE.REGISTER}_REJECTED`:
      newState.removePending(action.type.replace('_REJECTED', ''));
      if (action.payload.response.status === 409) {
        newState.errors['emailAddress'] = [];
        newState.errors['emailAddress'].push('Duplicated email address!');
      }
      if (action.payload.response.status === 400) {
        const data = action.payload.response.data;
        newState.firstNameError = data.firstNameError;
        newState.lastNameError = data.lastNameError;
        newState.emailAddressError = data.emailAddressError;
        newState.passwordError = data.passwordError;
      }
      break;
    case `${AUTH_TYPE.SIGN_IN}_REJECTED`:
      newState.removePending(action.type.replace('_REJECTED', ''));
      break;
    case AUTH_TYPE.LOG_OUT:
      newState.accessToken = '';
      newState.firstName = '';
      newState.lastName = '';
      newState.emailAddress = '';
      newState.emailConfirmed = false;
      localStorage.clear();
      break;
    case AUTH_TYPE.UPDATE:
      newState.id = action.payload.id;
      newState.accessToken = action.payload.accessToken;
      newState.firstName = action.payload.accessToken;
      newState.lastName = action.payload.lastName;
      newState.emailAddress = action.payload.emailAddress;
      newState.emailConfirmed = action.payload.emailConfirmed;
      localStorage.auth = JSON.stringify(action.payload);
      break;
    default:
  }
  return newState;
};

export default reducer;
