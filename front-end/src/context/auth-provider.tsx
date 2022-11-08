import { createContext, useState, FC, PropsWithChildren } from 'react';
import jwtDecode from 'jwt-decode';

import { TokenData } from 'shared/user';

export class AuthState {
  constructor(accessToken: string = '') {
    const tokenData = (accessToken ? jwtDecode(accessToken) : {}) as TokenData;

    this.id = isNaN(tokenData?.id) ? -1 : parseInt(tokenData?.id + '');
    this.accessToken = accessToken ?? '';
    this.firstName = tokenData?.firstName ?? '';
    this.lastName = tokenData?.lastName ?? '';
    this.emailAddress = tokenData?.emailAddress ?? '';
    this.type = tokenData?.type ?? '';
    this.roles = tokenData?.roles ?? [];
    this.exp = tokenData?.exp ?? 0;
    this.iat = tokenData?.iat ?? 0;
  }
  id: number;
  accessToken: string;
  firstName: string;
  lastName: string;
  emailAddress: string;
  roles: string[] = [];
  type: string;
  exp: number = 0;
  iat: number = 0;
}

interface AuthContextInterface {
  auth: AuthState;
  setAuth: (auth: AuthState) => void;
}

const AuthContext = createContext<AuthContextInterface>({} as AuthContextInterface);

export const AuthProvider: FC<PropsWithChildren> = ({ children }) => {
  const [auth, setAuth] = useState(new AuthState());

  return <AuthContext.Provider value={{ auth, setAuth }}>{children}</AuthContext.Provider>;
};

export default AuthContext;
