import { Reducer } from 'redux';
import cloneDeep from 'lodash/cloneDeep';

import { USER_TYPE, UserState } from './types';

let initialState: UserState = new UserState();

const reducer: Reducer<UserState> = (state = initialState, action) => {
  const newState: UserState = cloneDeep(state);
  switch (action.type) {
    case `${USER_TYPE.GET_USER_SESSIONS}_PENDING`:
      newState.pendingTypes.push(action.type.replace('_PENDING', ''));
      break;

    case `${USER_TYPE.GET_USER_SESSIONS}_FULFILLED`:
      console.log(action.payload.data);
      newState.removePending(action.type.replace('_FULFILLED', ''));
      break;

    case `${USER_TYPE.GET_USER_SESSIONS}_REJECTED`:
      newState.removePending(action.type.replace('_REJECTED', ''));
      break;
    default:
  }
  return newState;
};

export default reducer;
