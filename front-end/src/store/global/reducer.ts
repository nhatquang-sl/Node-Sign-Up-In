import { Reducer } from 'redux';
import cloneDeep from 'lodash/cloneDeep';

import { GLOBAL_TYPE, GlobalState } from './types';

const initialState: GlobalState = new GlobalState();

const reducer: Reducer<GlobalState> = (state = initialState, action) => {
  const newState: GlobalState = cloneDeep(state);

  switch (action.type) {
    case `${GLOBAL_TYPE.ERR_NETWORK}`:
      newState.errNetwork = action.payload;
      break;
  }
  return newState;
};

export default reducer;
