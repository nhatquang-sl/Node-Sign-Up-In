import { UserAuthDto } from 'shared/user/dto';

export enum AUTH_TYPE {
  REGISTER = 'REGISTER',
  SIGN_IN = 'SIGN_IN',
  LOG_OUT = 'LOG_OUT',
  UPDATE = 'UPDATE_AUTH',
}

interface Dictionary<T> {
  [key: string]: T;
}

export class AuthState implements UserAuthDto {
  id: number = -1;
  accessToken: string = '';
  firstName: string = '';
  lastName: string = '';
  emailAddress: string = '';
  emailConfirmed: boolean = false;
  pendingTypes: string[] = [];
  errors: Dictionary<string[]> = {};
  firstNameError: string | undefined;
  lastNameError: string | undefined;
  emailAddressError: string | undefined;
  passwordError: string[] = [];
  pendingSignUp(): boolean {
    return this.pendingTypes.includes(AUTH_TYPE.REGISTER);
  }
  removePending(pendingType: string): void {
    this.pendingTypes = this.pendingTypes.filter((pt) => pt !== pendingType);
  }
}
