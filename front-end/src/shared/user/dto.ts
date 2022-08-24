export class UserDto {
  declare id: number;
  declare firstName: string;
  declare lastName: string;
  declare emailAddress: string;
  declare emailConfirmed: boolean | false;
}

export class UserAuthDto extends UserDto {
  declare accessToken: string;
}

export class UserLoginDto {
  constructor(obj: any) {
    this.emailAddress = obj?.emailAddress;
    this.password = obj?.password;
  }
  declare emailAddress: string;
  declare password: string;
}

export class UserRegisterDto extends UserLoginDto {
  constructor(obj: any) {
    super(obj);
    this.firstName = obj.firstName;
    this.lastName = obj.lastName;
  }
  declare firstName: string;
  declare lastName: string;
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

// export type { UserDto, UserAuthDto, UserLoginDto };
