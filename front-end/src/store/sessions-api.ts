import { apiSlice } from 'store/api-slice';
import { Session } from 'shared/user';
import { PaginationWithData } from 'shared/utilities';

export const sessionsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // getSessions: builder.mutation<PaginationWithData<Session>, Pagination>({
    //   query: ({ page, size }: Pagination) => ({
    //     url: `user/sessions?page=${page}&size=${size}`,
    //     method: 'GET',
    //   }),
    //   // async onQueryStarted(_, { dispatch, queryFulfilled }) {
    //   //   try {
    //   //     const { data } = await queryFulfilled;
    //   //     dispatch(setSessionsPage(data));
    //   //   } catch (err) {}
    //   // },
    // }),
    getSessions: builder.query<PaginationWithData<Session>, { page: number; size: number }>({
      query: ({ page, size }: { page: number; size: number }) => ({
        url: `user/sessions?page=${page}&size=${size}`,
        method: 'GET',
      }),
    }),
  }),
});
export const { useGetSessionsQuery } = sessionsApi;

export default sessionsApi;
