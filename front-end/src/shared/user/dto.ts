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

export type { UserDto, UserAuthDto, UserLoginDto, UserRegisterDto };
