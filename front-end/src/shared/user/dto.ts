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

export interface UserSession {
  id: number;
  userId: number;
  ipAddress: string;
  userAgent: string | null;
  accessToken: string | null;
  refreshToken: string | null;
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

export type TokenData = {
  userId: number;
  roles: string[];
  type: string;
  exp: number;
  iat: number;
};
// export type { UserDto, UserAuthDto, UserLoginDto };
