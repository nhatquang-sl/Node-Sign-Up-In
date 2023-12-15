import { RootState } from './index';
import { createSlice, createEntityAdapter, PayloadAction } from '@reduxjs/toolkit';
import { Session } from 'shared/user';
import { Pagination, PaginationWithData } from 'shared/utilities/dto';

type SessionsState = {
  pagination: Pagination;
};

export const userSessionsAdapter = createEntityAdapter<Session>({});

const initialState = userSessionsAdapter.getInitialState<SessionsState>({
  pagination: {
    total: 0,
    page: 0,
    size: 10,
  },
});

export const sessionsSlice = createSlice({
  name: 'userSessions',
  initialState,
  reducers: {
    setSessionsPage: (state, action: PayloadAction<PaginationWithData<Session>>) => {
      state.pagination = action.payload;
      userSessionsAdapter.setAll(state, action.payload.items);
    },
  },
});

export const {
  selectAll: selectSessions,
  selectById: selectSessionById,
  selectIds: selectSessionIds,
} = userSessionsAdapter.getSelectors<RootState>((state) => state.sessions);

export const getPagination = (state: RootState) => state.sessions.pagination;

export const { setSessionsPage } = sessionsSlice.actions;
export default sessionsSlice.reducer;
