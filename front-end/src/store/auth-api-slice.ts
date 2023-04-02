import { apiSlice } from 'store/api-slice';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import { apiService } from 'hooks/use-api-service';
import jwtDecode from 'jwt-decode';
import { TokenData, UserAuthDto, UserLoginDto } from 'shared/user';
import { RootState } from 'store';
import { setAuth } from 'store/auth-slice';
import { showSnackbar } from './snackbar-slice';
import { QueryFulfilledRejectionReason } from '@reduxjs/toolkit/dist/query/endpointDefinitions';
import { BaseQueryFn, FetchBaseQueryError } from '@reduxjs/toolkit/dist/query';

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<UserAuthDto, UserLoginDto>({
      query: (userLogin: UserLoginDto) => ({
        url: `auth/login`,
        method: 'POST',
        body: userLogin,
      }),
      async onQueryStarted(userLogin, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setAuth(data.accessToken));
        } catch (err) {
          const res = (err as QueryFulfilledRejectionReason<BaseQueryFn>).error as {
            status: number;
            data: { message: string };
          };
          const status = res?.status ?? 0;
          if ([400, 401].includes(status)) {
            const message = res?.data.message;
            message && dispatch(showSnackbar(message, 'error'));
          }
        }
      },
    }),
    refreshToken: builder.mutation<UserAuthDto, void>({
      query: () => ({
        url: '/auth/refresh-token',
        method: 'POST',
      }),
    }),
  }),
});

export const { useLoginMutation, useRefreshTokenMutation } = authApiSlice;
