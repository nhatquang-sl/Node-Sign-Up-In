import { apiSlice } from 'store/api-slice';
import { UserAuthDto, UserLoginDto } from 'shared/user';
import { setAuth } from 'store/auth-slice';
import { showSnackbar } from './snackbar-slice';
import { QueryFulfilledRejectionReason } from '@reduxjs/toolkit/dist/query/endpointDefinitions';
import { BaseQueryFn } from '@reduxjs/toolkit/dist/query';

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<UserAuthDto, UserLoginDto>({
      query: (userLogin: UserLoginDto) => ({
        url: `auth/login`,
        method: 'POST',
        body: userLogin,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
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
        method: 'GET',
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setAuth(data.accessToken));
        } catch (err) {}
      },
    }),
  }),
});

export const { useLoginMutation, useRefreshTokenMutation } = authApiSlice;
