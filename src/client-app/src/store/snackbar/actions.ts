import { SNACKBAR, SnackbarMessage } from './types';

const openSnackbar = () => ({
  type: SNACKBAR.OPEN
});

const closeSnackbar = () => ({
  type: SNACKBAR.CLOSE
});
const showSnackbar = (
  message: string,
  severity: 'error' | 'info' | 'success' | 'warning' = 'info',
  vertical: 'top' | 'bottom' = 'bottom',
  horizontal: 'left' | 'right' | 'center' = 'center'
) => {
  let mes = new SnackbarMessage();
  mes.message = message;
  mes.key = new Date().getTime();
  mes.vertical = vertical;
  mes.horizontal = horizontal;
  mes.severity = severity;
  return {
    type: SNACKBAR.SHOW,
    payload: mes
  };
};

const cleanUpSnackbar = () => ({
  type: SNACKBAR.CLEAN_UP
});

export { openSnackbar, closeSnackbar, showSnackbar, cleanUpSnackbar };
