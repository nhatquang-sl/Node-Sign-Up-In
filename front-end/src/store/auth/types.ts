import { UserAuthDto } from 'shared/user/dto';

export enum AUTH_TYPE {
  REGISTER = 'REGISTER',
  LOGIN = 'LOGIN',
  LOG_OUT = 'LOG_OUT',
  UPDATE = 'UPDATE_AUTH',
}

// interface Dictionary<T> {
//   [key: string]: T;
// }

export class AuthError {
  firstName: string | undefined;
  lastName: string | undefined;
  emailAddress: string | undefined;
  password: string[] = [];
  login: string | undefined;
}

export class AuthState implements UserAuthDto {
  id: number = -1;
  accessToken: string = '';
  firstName: string = '';
  lastName: string = '';
  emailAddress: string = '';
  emailConfirmed: boolean = false;
  pendingTypes: string[] = [];
  error: AuthError = new AuthError();
  firstNameError: string | undefined;
  lastNameError: string | undefined;
  emailAddressError: string | undefined;
  passwordError: string[] = [];

  pendingRegister(): boolean {
    return this.pendingTypes.includes(AUTH_TYPE.REGISTER);
  }
  pendingLogin(): boolean {
    return this.pendingTypes.includes(AUTH_TYPE.LOGIN);
  }

  removePending(pendingType: string): void {
    this.pendingTypes = this.pendingTypes.filter((pt) => pt !== pendingType);
  }
}
