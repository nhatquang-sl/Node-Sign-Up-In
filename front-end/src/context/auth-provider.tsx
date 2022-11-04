import { createContext, useState, FC, PropsWithChildren } from 'react';
import jwt_decode from 'jwt-decode';

import { TokenData } from 'shared/user';

export class AuthState {
  constructor(obj: any = {}) {
    this.id = isNaN(obj?.id) ? -1 : parseInt(obj?.id);
    this.accessToken = obj?.accessToken ?? '';
    this.firstName = obj?.firstName ?? '';
    this.lastName = obj?.lastName ?? '';
    this.emailAddress = obj?.emailAddress ?? '';
    this.emailConfirmed = !!obj?.emailConfirmed;
    if (obj?.accessToken) {
      const tokenData = jwt_decode<TokenData>(obj?.accessToken);
      this.roles = tokenData.roles;
      this.exp = tokenData.exp;
      this.iat = tokenData.iat;

      // var d = new Date(0); // The 0 there is the key, which sets the date to the epoch
      // d.setUTCSeconds(this.exp);
      // console.log({ accessToken: this.accessToken, exp: d });
    }
  }
  id: number;
  accessToken: string;
  firstName: string;
  lastName: string;
  emailAddress: string;
  emailConfirmed: boolean;
  roles: string[] = [];
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
