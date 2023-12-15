import { createSlice } from '@reduxjs/toolkit';

type State = {
  count: number;
};

const initialState: State = { count: 0 };

export const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    increment: (state: State) => {
      state.count += 1;
    },
    decrement: (state: State) => {
      state.count -= 1;
    },
    incrementByAmount: (state, action) => {
      state.count += action.payload;
    },
  },
});

export const { increment, decrement, incrementByAmount } = counterSlice.actions;

export default counterSlice.reducer;
