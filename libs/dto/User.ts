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

interface UserRegisterDto {
  firstName: string;
  lastName: string;
  emailAddress: string;
  password: string;
}

export type { UserDto, UserAuthDto, UserRegisterDto };
