export enum AUTH_TYPE {
  SIGN_UP = 'SIGN_UP',
  SIGN_IN = 'SIGN_IN'
}

interface Dictionary<T> {
  [key: string]: T;
}

export class AuthState {
  accessToken: string = '';
  firstName: string = '';
  lastName: string = '';
  emailAddress: string = '';
  emailConfirmed: boolean = false;
  pendingTypes: string[] = [];
  errors: Dictionary<string[]> = {};
  pendingSignUp(): boolean {
    return this.pendingTypes.includes(AUTH_TYPE.SIGN_UP);
  }
  removePending(pendingType: string): void {
    this.pendingTypes = this.pendingTypes.filter((pt) => pt !== pendingType);
  }
}

export class User {
  id: number = 0;
  emailAddress: string = '';
  password: string = '';
  firstName: string = '';
  lastName: string = '';
  refreshToken: string = '';
  securityStamp: string = '';
  emailConfirmed: boolean = false;
}
