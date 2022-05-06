export enum SNACKBAR {
  OPEN = 'OPEN_SNACKBAR',
  CLOSE = 'CLOSE_SNACKBAR',
  SHOW = 'SHOW_SNACKBAR',
  CLEAN_UP = 'CLEAN_UP_SNACKBAR',
}

export class SnackbarMessage {
  message: string = '';
  key: number = 0;
  vertical: 'top' | 'bottom' = 'bottom';
  horizontal: 'left' | 'right' | 'center' = 'center';
  severity: 'error' | 'info' | 'success' | 'warning' = 'info';
}

export class SnackbarState {
  open: boolean = false;
  snackPack: SnackbarMessage[] = [];
  messageInfo?: SnackbarMessage;
}
