import { Reducer } from 'redux';
import cloneDeep from 'lodash/cloneDeep';

import { SNACKBAR, SnackbarState } from './types';

const initialState: SnackbarState = new SnackbarState();

const reducer: Reducer<SnackbarState> = (state = initialState, action) => {
  const newState: SnackbarState = cloneDeep(state);

  switch (action.type) {
    case `${SNACKBAR.OPEN}`:
      newState.messageInfo = newState.snackPack[0];
      newState.snackPack = [];
      newState.open = true;
      break;
    case `${SNACKBAR.CLOSE}`:
      newState.open = false;
      break;
    case SNACKBAR.SHOW:
      newState.snackPack.push(action.payload);
      break;
    case SNACKBAR.CLEAN_UP:
      newState.messageInfo = undefined;
      break;
  }
  return newState;
};

export default reducer;
