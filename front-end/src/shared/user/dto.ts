export class UserDto {
  id: number = 0;
  firstName: string = '';
  lastName: string = '';
  emailAddress: string = '';
  emailConfirmed: boolean = false;
}

export class UserAuthDto extends UserDto {
  accessToken: string = '';
}

export class UserLoginDto {
  constructor(obj: any) {
    this.emailAddress = obj?.emailAddress;
    this.password = obj?.password;
  }
  emailAddress: string;
  password: string;
}

export class UserRegisterDto extends UserLoginDto {
  constructor(obj: any) {
    super(obj);
    this.firstName = obj.firstName;
    this.lastName = obj.lastName;
  }
  firstName: string;
  lastName: string;
}

export class UserRegisterErrorDto extends UserRegisterDto {
  constructor(obj: any) {
    super(obj);
    this.firstName = obj.firstName;
    this.lastName = obj.lastName;
  }
  firstName: string;
  lastName: string;
  firstNameError: string | undefined;
  lastNameError: string | undefined;
  emailAddressError: string | undefined;
  passwordError: string[] = [];
}

export interface Session {
  id: number;
  userId: number;
  ipAddress: string;
  userAgent: string | null;
  accessToken: string | null;
  refreshToken: string | null;
  createdAt: string;
}

export interface UserForgotPasswordDto {
  id: number;
  userId: number;
  ipAddress: string | null;
  userAgent: string | null;
  password: string | null;
  token: string;
  createdAt: string;
  updatedAt: string;
}

export enum TokenType {
  Login = 'LOGIN',
  NeedActivate = 'NEED_ACTIVATE',
  ResetPassword = 'RESET_PASSWORD',
}

export class TokenData {
  id: number = 0;
  firstName: string = '';
  lastName: string = '';
  emailAddress: string = '';
  roles: string[] = [];
  type: TokenType = TokenType.NeedActivate;
  exp: number = 0;
  iat: number = 0;
}

// export type { UserDto, UserAuthDto, UserLoginDto };
