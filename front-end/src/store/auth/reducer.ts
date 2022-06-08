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
  initialState.lastDateResetPassword = localAuth.lastDateResetPassword ?? 0;
}

const reducer: Reducer<AuthState> = (state = initialState, action) => {
  const newState: AuthState = cloneDeep(state);
  const status = action.payload?.response?.status;
  const data = action.payload?.data ?? action.payload?.response?.data;

  if (data?.code === 'ERR_NETWORK') {
    newState.removePending(action.type);
    return newState;
  }
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
    case `${AUTH_TYPE.SEND_EMAIL_RESET_PASSWORD}_PENDING`:
      newState.emailAddressError = '';
      // newState.lastDateResetPassword = new Date().getTime();
      newState.pendingTypes.push(action.type.replace('_PENDING', ''));
      break;
    case `${AUTH_TYPE.SET_NEW_PASSWORD}_PENDING`:
      newState.error.password = [];
      newState.error.message = '';
      newState.pendingTypes.push(action.type.replace('_PENDING', ''));
      break;

    case `${AUTH_TYPE.REGISTER}_FULFILLED`:
    case `${AUTH_TYPE.LOGIN}_FULFILLED`:
      newState.accessToken = action.payload.data.accessToken;
      newState.firstName = action.payload.data.firstName;
      newState.lastName = action.payload.data.lastName;
      newState.emailAddress = action.payload.data.emailAddress;
      newState.emailConfirmed = action.payload.data.emailConfirmed;
      newState.removePending(action.type.replace('_FULFILLED', ''));
      break;
    case `${AUTH_TYPE.GET_USER_PROFILE}_FULFILLED`:
      newState.firstName = action.payload.data.firstName;
      newState.lastName = action.payload.data.lastName;
      newState.emailAddress = action.payload.data.emailAddress;
      newState.emailConfirmed = action.payload.data.emailConfirmed;
      newState.removePending(action.type.replace('_FULFILLED', ''));
      break;
    case `${AUTH_TYPE.SEND_ACTIVATE_LINK}_FULFILLED`:
    case `${AUTH_TYPE.REGISTER_CONFIRM}_FULFILLED`:
      newState.removePending(action.type.replace('_FULFILLED', ''));
      break;
    case `${AUTH_TYPE.SEND_EMAIL_RESET_PASSWORD}_FULFILLED`:
      newState.lastDateResetPassword = data.lastDate;
      newState.removePending(action.type);
      break;
    case `${AUTH_TYPE.SET_NEW_PASSWORD}_FULFILLED`:
      newState.error.password = [];
      newState.error.message = '';
      newState.removePending(action.type);
      break;
    case `${AUTH_TYPE.REGISTER}_REJECTED`:
      newState.removePending(action.type.replace('_REJECTED', ''));
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
      }
      newState.removePending(action.type.replace('_REJECTED', ''));
      break;
    case `${AUTH_TYPE.SEND_EMAIL_RESET_PASSWORD}_REJECTED`:
      newState.emailAddressError = data.emailAddressError;
      newState.lastDateResetPassword = data.lastDate ?? 0;
      newState.removePending(action.type);
      break;
    case `${AUTH_TYPE.SET_NEW_PASSWORD}_REJECTED`:
      newState.error.password = [];
      newState.error.message = '';
      if (status === 400) newState.error.password = data.passwordError;
      newState.error.message = data.message;
      newState.removePending(action.type);
      break;
    case AUTH_TYPE.LOG_OUT:
      newState.accessToken = '';
      newState.firstName = '';
      newState.lastName = '';
      newState.emailAddress = '';
      newState.emailConfirmed = false;
      break;
    case AUTH_TYPE.UPDATE:
      newState.id = action.payload.id;
      newState.accessToken = action.payload.accessToken;
      newState.firstName = action.payload.firstName;
      newState.lastName = action.payload.lastName;
      newState.emailAddress = action.payload.emailAddress;
      newState.emailConfirmed = action.payload.emailConfirmed;
      break;
    default:
  }
  localStorage.auth = JSON.stringify({
    accessToken: newState.accessToken,
    emailAddress: newState.emailAddress,
    emailConfirmed: newState.emailConfirmed,
    firstName: newState.firstName,
    lastName: newState.lastName,
    lastDateResetPassword: newState.lastDateResetPassword,
  });
  return newState;
};

export default reducer;
