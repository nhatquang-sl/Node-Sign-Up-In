import { Reducer } from 'redux';
import { SettingsState, SETTINGS } from './types';

const initialState: SettingsState = {
  sideBarOpen: false,
  headerOpen: false,
  loading: false,
};

const reducer: Reducer<SettingsState> = (state = initialState, action) => {
  let newState = JSON.parse(JSON.stringify(state));

  switch (action.type) {
    case `${SETTINGS.OPEN_SIDEBAR}`:
      newState.sideBarOpen = true;
      break;
    case `${SETTINGS.CLOSE_SIDEBAR}`:
      newState.sideBarOpen = false;
      break;
    case `${SETTINGS.OPEN_HEADER}`:
      newState.headerOpen = true;
      break;
    case `${SETTINGS.OPEN_SIDEBAR_AND_HEADER}`:
      newState.sideBarOpen = true;
      newState.headerOpen = true;
      break;
    case `${SETTINGS.CLOSE_SIDEBAR_AND_HEADER}`:
      newState.sideBarOpen = false;
      newState.headerOpen = false;
      break;
    case `${SETTINGS.OPEN_LOADING}`:
      newState.loading = true;
      break;
    case `${SETTINGS.CLOSE_LOADING}`:
      newState.loading = false;
      break;

    default:
  }

  return newState;
};

export default reducer;
