import { Reducer } from 'redux';
import { SettingsState, SETTINGS } from './types';

const initialState: SettingsState = {
  sideBarOpen: false,
  headerOpen: true
};

const reducer: Reducer<SettingsState> = (state = initialState, action) => {
  let newState = JSON.parse(JSON.stringify(state));

  switch (action.type) {
    case `${SETTINGS.OPEN_SIDEBAR_AND_HEADER}`:
      newState.sideBarOpen = true;
      newState.headerOpen = true;
      break;
    case `${SETTINGS.CLOSE_SIDEBAR_AND_HEADER}`:
      newState.sideBarOpen = false;
      newState.headerOpen = false;
      break;

    default:
  }

  return newState;
};

export default reducer;
