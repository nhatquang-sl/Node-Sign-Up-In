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

export { UserDto, UserAuthDto };
