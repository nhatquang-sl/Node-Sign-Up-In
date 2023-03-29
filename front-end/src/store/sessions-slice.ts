import { RootState } from './index';
import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';
import { API_ENDPOINT } from './constants';
import { Session } from 'shared/user';
import { PaginationDto } from 'shared/utilities/dto';

export const apiService = axios.create({
  baseURL: API_ENDPOINT,
  withCredentials: true,
});

type SessionsState = {
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string;
  pagination: PaginationDto;
};

const userSessionsAdapter = createEntityAdapter<Session>({});

const initialState = userSessionsAdapter.getInitialState<SessionsState>({
  status: 'idle',
  error: '',
  pagination: {
    total: 0,
    page: 1,
    size: 10,
  },
});

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
  name: 'userSessions',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchUserSessions.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.pagination = action.payload;
        userSessionsAdapter.upsertMany(state, action.payload.items);
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

export const getStatus = (state: RootState) => state.sessions.status;
export const getError = (state: RootState) => state.sessions.error;
export const getPagination = (state: RootState) => state.sessions.pagination;

export const {
  selectAll: selectSessions,
  selectById: selectSessionById,
  selectIds: selectSessionIds,
} = userSessionsAdapter.getSelectors<RootState>((state) => state.sessions);

export default usersSlice.reducer;
