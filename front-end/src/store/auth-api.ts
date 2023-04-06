import { UserRegisterDto, UserRegisterErrorDto } from 'shared/user/dto';
import { appApi } from 'store/app-api';
import { UserAuthDto, UserLoginDto } from 'shared/user';
import { setAuth } from 'store/auth-slice';
import { showSnackbar } from './snackbar-slice';
import { QueryFulfilledRejectionReason } from '@reduxjs/toolkit/dist/query/endpointDefinitions';
import { BaseQueryFn } from '@reduxjs/toolkit/dist/query';

export const authApi = appApi.injectEndpoints({
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
    register: builder.mutation<UserAuthDto, UserRegisterDto>({
      query: (registerData: UserRegisterDto) => ({
        url: `auth/register`,
        method: 'POST',
        body: registerData,
      }),
      transformErrorResponse: (response): UserRegisterErrorDto => {
        return response.data as UserRegisterErrorDto;
      },
    }),
    sendActivateEmail: builder.mutation<any, void>({
      query: () => ({
        url: `auth/send-activation-email`,
        method: 'POST',
      }),
    }),
    activate: builder.mutation<void, string>({
      query: (activationCode: string) => ({
        url: `auth/activate/${activationCode}`,
        method: 'GET',
      }),
      transformErrorResponse: (response): { message: string } => {
        return response.data as { message: string };
      },
    }),
  }),
});

export const {
  useLoginMutation,
  useRefreshTokenMutation,
  useRegisterMutation,
  useSendActivateEmailMutation,
  useActivateMutation,
} = authApi;
