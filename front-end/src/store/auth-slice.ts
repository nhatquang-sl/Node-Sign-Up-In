import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import jwtDecode from 'jwt-decode';
import { TokenData, TokenType } from 'shared/user';
import { RootState } from 'store';

type AuthState = {
  id: number;
  accessToken: string;
  firstName: string;
  lastName: string;
  emailAddress: string;
  roles: string[];
  type: TokenType | null;
  exp: number;
  iat: number;
};

const initialState: AuthState = {
  id: -1,
  accessToken: '',
  firstName: '',
  lastName: '',
  emailAddress: '',
  roles: [],
  type: null,
  exp: 0,
  iat: 0,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth: (state: AuthState, action: PayloadAction<string>) => {
      const accessToken = action.payload;
      const tokenData = (accessToken ? jwtDecode(accessToken) : {}) as TokenData;

      state.id = isNaN(tokenData?.id) ? -1 : parseInt(tokenData?.id + '');
      state.accessToken = accessToken ?? '';
      state.firstName = tokenData?.firstName ?? '';
      state.lastName = tokenData?.lastName ?? '';
      state.emailAddress = tokenData?.emailAddress ?? '';
      state.type = tokenData?.type ?? '';
      state.roles = tokenData?.roles ?? [];
      state.exp = tokenData?.exp ?? 0;
      state.iat = tokenData?.iat ?? 0;
    },
  },
});

export const { setAuth } = authSlice.actions;
export const selectAuthType = (state: RootState) => state.auth.type;

export default authSlice.reducer;
