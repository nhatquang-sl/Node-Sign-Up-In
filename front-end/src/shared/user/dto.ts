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

interface UserLoginDto {
  emailAddress: string;
  password: string;
}

interface UserRegisterDto extends UserLoginDto {
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

export type { UserDto, UserAuthDto, UserLoginDto, UserRegisterDto };
