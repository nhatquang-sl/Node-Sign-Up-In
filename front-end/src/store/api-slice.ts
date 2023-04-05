import { RootState } from 'store';
// Need to use the React-specific entry point to allow generating React hooks
import {
  BaseQueryFn,
  createApi,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';
import { API_ENDPOINT } from './constants';
import { setAuth } from './auth-slice';

const baseQuery = fetchBaseQuery({
  baseUrl: API_ENDPOINT,
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.accessToken;
    // If we have a token set in state, let's assume that we should be passing it.
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }

    return headers;
  },
});

const baseQueryWithReAuth: BaseQueryFn<
  string | FetchArgs, // Args
  unknown, // Result
  FetchBaseQueryError
> = async (args, api, extraOptions): Promise<any> => {
  let result = await baseQuery(args, api, extraOptions);
  const { error } = result;
  console.log(error);

  if (error && error.status === 403) {
    console.log('sending refresh token');
    const refreshResult = await baseQuery('/refresh', api, extraOptions);
    console.log({ refreshResult });
  }
  // if (
  //   error &&
  //   (
  //     result?.error as {
  //       status: 'PARSING_ERROR';
  //       originalStatus: number;
  //       data: string;
  //       error: string;
  //     }
  //   ).originalStatus === 403
  // ) {
  //   console.log('sending refresh token');
  //   const refreshResult = await baseQuery('/refresh', api, extraOptions);
  //   console.log({ refreshResult });
  //   if (refreshResult?.data) {
  //     const accessToken = (api.getState() as RootState).auth.accessToken;
  //     api.dispatch(setAuth(accessToken));
  //     result = await baseQuery(args, api, extraOptions);
  //   }
  // }
  return result;
};

export const apiSlice = createApi({
  baseQuery: baseQueryWithReAuth,
  endpoints: () => ({}),
});
