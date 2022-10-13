import { Reducer } from 'redux';
import cloneDeep from 'lodash/cloneDeep';

import { ACTION, BnbState } from './types';

let initialState: BnbState = new BnbState();

const reducer: Reducer<BnbState> = (state = initialState, action) => {
  const newState: BnbState = cloneDeep(state);
  const status = action.payload?.response?.status;
  const data = action.payload?.response?.data ?? action.payload?.data ?? action.payload;

  if (data?.code === 'ERR_NETWORK') {
    newState.removePending(action.type);
    return newState;
  }
  switch (action.type) {
    case `${ACTION.GET_KLINES}_PENDING`:
      newState.pendingTypes.push(action.type.replace('_PENDING', ''));
      break;
    case `${ACTION.GET_KLINES}_FULFILLED`:
      console.log({ data });
      break;
  }

  return newState;
};

export default reducer;
