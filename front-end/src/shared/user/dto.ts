interface UserDto {
  id: number;
  firstName: string;
  lastName: string;
  emailAddress: string;
  emailConfirmed: boolean | false;
}

interface UserAuthDto extends UserDto {
  accessToken: string;
}

class UserLoginDto {
  declare emailAddress: string;
  declare password: string;
}

export class UserRegisterDto extends UserLoginDto {
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

export type { UserDto, UserAuthDto, UserLoginDto };
