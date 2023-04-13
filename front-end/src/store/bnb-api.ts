import { appApi } from 'store/app-api';
import { Balance, OpenOrder, Order, Position, OrderSide } from 'shared/bnb';

export const bnbApi = appApi.injectEndpoints({
  endpoints: (builder) => ({
    createListenKey: builder.mutation<string, void>({
      query: () => ({
        url: 'bnb/listenKey',
        method: 'POST',
      }),
      transformResponse: (responseData: { listenKey: string }, _, arg) => {
        console.log('responseData', responseData.listenKey);
        return responseData.listenKey;
      },
    }),
    createOrder: builder.mutation<void, Order>({
      query: (order: Order) => ({
        url: 'bnb/order',
        method: 'POST',
        body: order,
      }),
    }),
    getPositions: builder.query<Position[], { symbol: string; side: OrderSide }>({
      query: ({ symbol }: { symbol: string; side: OrderSide }) => ({
        url: `bnb/positions/${symbol}`,
        method: 'GET',
      }),
      transformResponse: (responseData: Position[], _, arg) => {
        return responseData.filter((d) =>
          arg.side === OrderSide.BUY ? d.positionAmt > 0 : d.positionAmt < 0
        );
      },
    }),
    getOpenOrders: builder.query<OpenOrder[], { symbol: string; side: OrderSide }>({
      query: ({ symbol }: { symbol: string; side: OrderSide }) => ({
        url: `bnb/openOrders/${symbol}`,
        method: 'GET',
      }),
      transformResponse: (responseData: OpenOrder[], _, arg) => {
        return responseData.filter(
          (d) =>
            (d.side.toUpperCase() === arg.side && d.type !== 'TAKE_PROFIT_MARKET') ||
            (d.side.toUpperCase() !== arg.side && d.type === 'TAKE_PROFIT_MARKET')
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
    getUsdtBalance: builder.mutation<Balance[], void>({
      query: () => ({
        url: 'bnb/balance',
        method: 'GET',
      }),
    }),
  }),
});

export const {
  useCreateListenKeyMutation,
  useCreateOrderMutation,
  useGetPositionsQuery,
  useGetOpenOrdersQuery,
  useCancelOrderMutation,
  useCancelAllOrdersMutation,
  useGetUsdtBalanceMutation,
} = bnbApi;
