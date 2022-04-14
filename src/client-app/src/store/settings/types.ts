export enum SETTINGS {
  OPEN_SIDEBAR_AND_HEADER = 'OPEN_SIDEBAR_AND_HEADER',
  CLOSE_SIDEBAR_AND_HEADER = 'CLOSE_SIDEBAR_AND_HEADER'
}

export interface SettingsState {
  sideBarOpen: boolean;
  headerOpen: boolean;
}
