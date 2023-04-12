import { appApi } from 'store/app-api';
import { OpenOrder, Position } from 'shared/bnb';

export const bnbApi = appApi.injectEndpoints({
  endpoints: (builder) => ({
    createListenKey: builder.mutation<string, void>({
      query: () => ({
        url: 'bnb/listenKey',
        method: 'POST',
      }),
    }),
    getPositions: builder.query<Position[], { symbol: string; side: string }>({
      query: ({ symbol }: { symbol: string; side: string }) => ({
        url: `bnb/positions/${symbol}`,
        method: 'GET',
      }),
      transformResponse: (responseData: Position[], _, arg) => {
        return responseData.filter((d) =>
          arg.side === 'buy' ? d.positionAmt > 0 : d.positionAmt < 0
        );
      },
    }),
    getOpenOrders: builder.query<OpenOrder[], { symbol: string; side: string }>({
      query: ({ symbol }: { symbol: string; side: string }) => ({
        url: `bnb/openOrders/${symbol}`,
        method: 'GET',
      }),
      transformResponse: (responseData: OpenOrder[], _, arg) => {
        return responseData.filter(
          (d) =>
            (d.side.toLocaleLowerCase() === arg.side && d.type !== 'TAKE_PROFIT_MARKET') ||
            (d.side.toLocaleLowerCase() !== arg.side && d.type === 'TAKE_PROFIT_MARKET')
        );
      },
    }),
    cancelOrder: builder.mutation<void, { symbol: string; orderId: number }>({
      query: ({ symbol, orderId }: { symbol: string; orderId: number }) => ({
        url: `bnb/order/${symbol}/${orderId}`,
        method: 'DELETE',
      }),
    }),
    cancelAllOrders: builder.mutation<void, string>({
      query: (symbol: string) => ({
        url: `bnb/all-orders/${symbol}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useCreateListenKeyMutation,
  useGetPositionsQuery,
  useGetOpenOrdersQuery,
  useCancelOrderMutation,
  useCancelAllOrdersMutation,
} = bnbApi;
