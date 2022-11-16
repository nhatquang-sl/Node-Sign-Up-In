import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type SettingsState = {
  sideBarOpen: boolean;
  headerOpen: boolean;
  loading: boolean;
};

const initialState: SettingsState = { sideBarOpen: false, headerOpen: true, loading: false };

export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setSidebar: (state: SettingsState, action: PayloadAction<boolean>) => {
      state.sideBarOpen = action.payload;
    },
    setHeader: (state: SettingsState, action: PayloadAction<boolean>) => {
      state.headerOpen = action.payload;
    },
    setSidebarAndHeader: (state: SettingsState, action: PayloadAction<boolean>) => {
      state.sideBarOpen = action.payload;
      state.headerOpen = action.payload;
    },
    setLoading: (state: SettingsState, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { setSidebar, setHeader, setSidebarAndHeader, setLoading } = settingsSlice.actions;

export default settingsSlice.reducer;
