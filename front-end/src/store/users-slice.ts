import { RootState } from './index';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';
import { API_ENDPOINT } from './constants';
import { UserSession } from 'shared/user';

export const apiService = axios.create({
  baseURL: API_ENDPOINT,
  withCredentials: true,
});

type UsersState = {
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  sessions: UserSession[];
  total: number;
  page: number;
  size: number;
  error: string;
};

const initialState: UsersState = {
  status: 'idle',
  error: '',
  sessions: [],
  total: 0,
  page: 1,
  size: 10,
};

export const fetchUserSessions = createAsyncThunk(
  `user/sessions`,
  async (params: { accessToken: string; page: number; size: number }) => {
    const { accessToken, page, size } = params;
    try {
      const response = await apiService.get(`user/sessions?page=${page}&size=${size}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      return response.data;
    } catch (err) {
      if (err instanceof AxiosError) return err.response;
    }
  }
);

export const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchUserSessions.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.sessions = action.payload.items;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.size = action.payload.size;
      })
      .addCase(fetchUserSessions.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(fetchUserSessions.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? '';
      });
  },
});

export const getSessions = (state: RootState) => {
  const { sessions, page, size, total } = state.users;
  return { sessions, page, size, total };
};
export const getStatus = (state: RootState) => state.users.status;
export const getError = (state: RootState) => state.users.error;
export const selectSession = (state: RootState, sessionId: number) =>
  state.users.sessions.find((s) => s.id === sessionId);

// export const {} = usersSlice.actions;

export default usersSlice.reducer;
