import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type SnackbarMessage = {
  message: string;
  key: number;
  vertical: 'top' | 'bottom';
  horizontal: 'left' | 'right' | 'center';
  severity: 'error' | 'info' | 'success' | 'warning';
};

type SnackbarState = {
  open: boolean;
  snackPack: SnackbarMessage[];
  messageInfo?: SnackbarMessage;
};

const initialState: SnackbarState = { open: false, snackPack: [] };

export const snackbarSlice = createSlice({
  name: 'snackbar',
  initialState,
  reducers: {
    showSnackbar: (state: SnackbarState, action: PayloadAction<SnackbarMessage>) => {
      action.payload.key = new Date().getTime();
      state.snackPack.push(action.payload);
    },
    openSnackbar: (state: SnackbarState) => {
      state.open = true;
      state.messageInfo = state.snackPack[0];
      state.snackPack = [];
    },
    closeSnackbar: (state: SnackbarState) => {
      state.open = false;
    },
    cleanUpSnackbar: (state: SnackbarState) => {
      state.messageInfo = undefined;
    },
  },
});

export const { showSnackbar, openSnackbar, closeSnackbar, cleanUpSnackbar } = snackbarSlice.actions;

export default snackbarSlice.reducer;
