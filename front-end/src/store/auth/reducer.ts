import { Reducer } from 'redux';
import cloneDeep from 'lodash/cloneDeep';

import { AUTH_TYPE, AuthState, AuthError } from './types';

let initialState: AuthState = new AuthState();
if (localStorage.auth) {
  const localAuth = JSON.parse(localStorage.auth);
  initialState.accessToken = localAuth.accessToken;
  initialState.emailAddress = localAuth.emailAddress;
  initialState.emailConfirmed = localAuth.emailConfirmed;
  initialState.firstName = localAuth.firstName;
  initialState.lastName = localAuth.lastName;
}

const reducer: Reducer<AuthState> = (state = initialState, action) => {
  const newState: AuthState = cloneDeep(state);
  const status = action.payload?.response?.status;
  switch (action.type) {
    case `${AUTH_TYPE.REGISTER}_PENDING`:
    case `${AUTH_TYPE.LOGIN}_PENDING`:
      newState.error = new AuthError();
      newState.pendingTypes.push(action.type.replace('_PENDING', ''));
      break;
    case `${AUTH_TYPE.SEND_ACTIVATE_LINK}_PENDING`:
    case `${AUTH_TYPE.REGISTER_CONFIRM}_PENDING`:
    case `${AUTH_TYPE.GET_USER_PROFILE}_PENDING`:
      newState.pendingTypes.push(action.type.replace('_PENDING', ''));
      break;
    case `${AUTH_TYPE.REGISTER}_FULFILLED`:
    case `${AUTH_TYPE.LOGIN}_FULFILLED`:
      newState.accessToken = action.payload.data.accessToken;
      newState.firstName = action.payload.data.firstName;
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
    case `${AUTH_TYPE.GET_USER_PROFILE}_FULFILLED`:
      newState.firstName = action.payload.data.firstName;
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
    case `${AUTH_TYPE.SEND_ACTIVATE_LINK}_FULFILLED`:
    case `${AUTH_TYPE.REGISTER_CONFIRM}_FULFILLED`:
      newState.removePending(action.type.replace('_FULFILLED', ''));
      break;
    case `${AUTH_TYPE.REGISTER}_REJECTED`:
      newState.removePending(action.type.replace('_REJECTED', ''));
      const data = action.payload.response.data;
      if (action.payload.response.status === 409) {
        newState.emailAddressError = data.emailAddressError;
      }
      if (action.payload.response.status === 400) {
        newState.firstNameError = data.firstNameError;
        newState.lastNameError = data.lastNameError;
        newState.emailAddressError = data.emailAddressError;
        newState.passwordError = data.passwordError;
      }
      break;
    case `${AUTH_TYPE.LOGIN}_REJECTED`:
      console.log(action.payload.response);
      if (status === 400 || status === 401) {
        newState.error.login = action.payload.response.data.message;
      }
      newState.removePending(action.type.replace('_REJECTED', ''));
      break;
    case `${AUTH_TYPE.SEND_ACTIVATE_LINK}_REJECTED`:
      if (status === 403) {
        newState.accessToken = '';
        newState.firstName = '';
        newState.lastName = '';
        newState.emailAddress = '';
        newState.emailConfirmed = false;
        localStorage.clear();
      }
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
