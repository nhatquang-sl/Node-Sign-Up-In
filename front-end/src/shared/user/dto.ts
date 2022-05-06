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

export type { UserDto, UserAuthDto, UserLoginDto, UserRegisterDto };
