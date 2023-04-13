import { OrderSide, Position } from 'shared/bnb/dto';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { OpenOrder } from 'shared/bnb';
import { RootState } from 'store';
import { bnbApi } from './bnb-api';
import { round3Dec } from 'shared/utilities';

class BnbState {
  symbol: string = localStorage.orderSymbol ?? 'nearusdt';
  side: OrderSide = localStorage.orderSide ?? OrderSide.BUY;
  leverage: number = 20;
  usdtBalance: number = 0;
  listenKey: string = '';
  openOrders: OpenOrder[] = [];
  positions: Position[] = [];
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
    addOpenOrder: (state: BnbState, action: PayloadAction<OpenOrder>) => {
      state.openOrders.push(action.payload);
    },
    removeOpenOrder: (state: BnbState, action: PayloadAction<number>) => {
      state.openOrders = state.openOrders.filter((o) => o.orderId !== action.payload);
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
      const { cancellingOrderIds } = state;
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

export const { setSymbol, setSide, setListenKey, addOpenOrder, removeOpenOrder } = bnbSlice.actions;
export const selectSymbol = (state: RootState) => state.bnb.symbol;
export const selectSide = (state: RootState) => state.bnb.side;
export const selectListenKey = (state: RootState) => state.bnb.listenKey;
export const selectOpenOrders = (state: RootState) => state.bnb.openOrders;
export const selectTotalOpenOrders = (state: RootState) => state.bnb.openOrders.length;
export const selectTotalPositions = (state: RootState) => state.bnb.positions.length;
export const selectPositions = (state: RootState) => state.bnb.positions;
export const selectCancelling = (state: RootState) => ({
  cancellingAll: state.bnb.cancellingAll,
  cancellingOrderIds: state.bnb.cancellingOrderIds,
});
export const selectUsdtBalance = (state: RootState) => state.bnb.usdtBalance;
export const selectEstLiqAndEntry = (state: RootState) => {
  let entry = 0,
    liq = 0,
    quantityTotal = 0,
    sizeTotal = 0;
  const { side, openOrders, positions, leverage } = state.bnb;

  for (const p of positions) {
    quantityTotal += Math.abs(p.positionAmt);
    sizeTotal += Math.abs(p.positionAmt * p.entryPrice);
  }

  for (const o of openOrders) {
    quantityTotal += o.origQty;
    sizeTotal += o.origQty * o.price;
  }

  if (positions.length || openOrders.length) {
    entry = round3Dec(sizeTotal / quantityTotal);
    console.log({ quantityTotal, sizeTotal, entry, side });
    console.log(
      entry / 100,
      (80 * entry) / (100 * leverage),
      entry + (56 * entry) / (100 * leverage)
    );
    liq = round3Dec(entry - ((79 / leverage) * entry) / 100);
    if (side === OrderSide.SELL) {
      liq = round3Dec(entry + ((76 / leverage) * entry) / 100);
    }
  }

  return { entry, liq };
};

export default bnbSlice.reducer;
