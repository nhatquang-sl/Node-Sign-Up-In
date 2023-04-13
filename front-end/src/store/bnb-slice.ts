import { OrderSide } from './../shared/bnb/dto';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { OpenOrder } from 'shared/bnb';
import { RootState } from 'store';
import { bnbApi } from './bnb-api';

class BnbState {
  symbol: string = localStorage.orderSymbol ?? 'nearusdt';
  side: OrderSide = localStorage.orderSide ?? OrderSide.BUY;
  usdtBalance: number = 0;
  listenKey: string = '';
  openOrders: OpenOrder[] = [];
  cancellingOrderIds: number[] = [];
  cancellingAll: boolean = false;
}

const initialState = JSON.parse(JSON.stringify(new BnbState())) as BnbState;

export const bnbSlice = createSlice({
  name: 'bnb',
  initialState,
  reducers: {
    setSymbol: (state: BnbState, action: PayloadAction<string>) => {
      state.symbol = action.payload;
      localStorage.orderSymbol = action.payload;
    },
    setSide: (state: BnbState, action: PayloadAction<OrderSide>) => {
      state.side = action.payload;
      localStorage.orderSide = action.payload;
    },
    setListenKey: (state: BnbState, action: PayloadAction<string>) => {
      state.listenKey = action.payload;
    },
    setOpenOrders: (state: BnbState, action: PayloadAction<OpenOrder[]>) => {
      state.openOrders = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(bnbApi.endpoints.getOpenOrders.matchFulfilled, (state, { payload }) => {
      state.openOrders = payload;
    });
    builder.addMatcher(bnbApi.endpoints.cancelOrder.matchPending, (state, action) => {
      const { orderId } = action.meta.arg.originalArgs;
      state.cancellingOrderIds.push(orderId);
    });
    builder.addMatcher(bnbApi.endpoints.cancelOrder.matchFulfilled, (state, action) => {
      const { orderId } = action.meta.arg.originalArgs;
      const { openOrders, cancellingOrderIds } = state;
      state.openOrders = openOrders.filter((o) => o.orderId !== orderId);
      state.cancellingOrderIds = cancellingOrderIds.filter((id) => id !== orderId);
    });
    builder.addMatcher(bnbApi.endpoints.cancelAllOrders.matchPending, (state) => {
      state.cancellingAll = true;
    });
    builder.addMatcher(bnbApi.endpoints.cancelAllOrders.matchFulfilled, (state) => {
      state.cancellingAll = false;
    });
    builder.addMatcher(bnbApi.endpoints.cancelAllOrders.matchRejected, (state) => {
      state.cancellingAll = false;
    });
    builder.addMatcher(bnbApi.endpoints.getUsdtBalance.matchFulfilled, (state, { payload }) => {
      state.usdtBalance = payload.filter((x) => x.asset === 'USDT')[0].availableBalance;
    });
  },
});

export const { setSymbol, setSide, setListenKey } = bnbSlice.actions;
export const selectSymbol = (state: RootState) => state.bnb.symbol;
export const selectSide = (state: RootState) => state.bnb.side;
export const selectListenKey = (state: RootState) => state.bnb.listenKey;
export const selectOpenOrders = (state: RootState) => state.bnb.openOrders;
export const selectCancelling = (state: RootState) => ({
  cancellingAll: state.bnb.cancellingAll,
  cancellingOrderIds: state.bnb.cancellingOrderIds,
});
export const selectUsdtBalance = (state: RootState) => state.bnb.usdtBalance;

export default bnbSlice.reducer;
