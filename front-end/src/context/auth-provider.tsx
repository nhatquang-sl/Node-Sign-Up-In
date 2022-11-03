import { createContext, useState, FC, PropsWithChildren } from 'react';

export class AuthState {
  constructor(obj: any = {}) {
    this.id = isNaN(obj?.id) ? -1 : parseInt(obj?.id);
    this.accessToken = obj?.accessToken;
    this.firstName = obj?.firstName;
    this.lastName = obj?.lastName;
    this.emailAddress = obj?.emailAddress;
    this.emailConfirmed = obj?.emailConfirmed;
  }
  id: number = -1;
  accessToken: string = '';
  firstName: string = '';
  lastName: string = '';
  emailAddress: string = '';
  emailConfirmed: boolean = false;
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
