import { UserAuthDto } from 'shared/user/dto';

export enum AUTH_TYPE {
  REGISTER = 'REGISTER',
  REGISTER_CONFIRM = 'REGISTER_CONFIRM',
  LOGIN = 'LOGIN',
  LOG_OUT = 'LOG_OUT',
  UPDATE = 'UPDATE_AUTH',
  SEND_ACTIVATE_LINK = 'SEND_ACTIVATE_LINK',
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
  pendingRegisterConfirm(): boolean {
    return this.pendingTypes.includes(AUTH_TYPE.REGISTER_CONFIRM);
  }
  pendingLogin(): boolean {
    return this.pendingTypes.includes(AUTH_TYPE.LOGIN);
  }
  pendingSendActivateLink(): boolean {
    return this.pendingTypes.includes(AUTH_TYPE.SEND_ACTIVATE_LINK);
  }
  removePending(pendingType: string): void {
    this.pendingTypes = this.pendingTypes.filter((pt) => pt !== pendingType);
  }
}
