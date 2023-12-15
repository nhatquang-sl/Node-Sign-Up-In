import bcrypt from 'bcrypt';
import LANG from '@libs/lang';
import { UserLoginDto, UserAuthDto, TokenType } from '@libs/user';

import { generateTokens } from '@application/common/utils';
import {
  ICommand,
  ICommandHandler,
  ICommandValidator,
  RegisterHandler,
  RegisterValidator,
  BadRequestError,
  UnauthorizedError,
} from '@qnn92/mediatorts';

import { User, Role, UserLoginHistory } from '@database';

export class UserLoginCommand extends UserLoginDto implements ICommand {
  constructor(obj: any) {
    super(obj);
    this.ipAddress = obj?.ipAddress;
    this.userAgent = obj?.userAgent;
  }
  ipAddress: string = '';
  userAgent: string = '';
}

export class UserLoginResult extends UserAuthDto {
  declare refreshToken: string;
}

@RegisterHandler
export class UserLoginCommandHandler implements ICommandHandler<UserLoginCommand, UserLoginResult> {
  async handle(command: UserLoginCommand): Promise<UserLoginResult> {
    const foundUser = await User.findOne({
      where: { emailAddress: command.emailAddress },
      include: [
        {
          model: Role,
          attributes: ['code'],
          through: {
            attributes: [],
          },
        },
      ],
    });
    if (!foundUser) throw new UnauthorizedError({ message: LANG.USER_NAME_PASSWORD_INVALID_ERROR });

    // Evaluate password
    const match = await bcrypt.compare(command.password + foundUser.salt, foundUser.password);
    if (!match) throw new UnauthorizedError({ message: LANG.USER_NAME_PASSWORD_INVALID_ERROR });

    // Create JWTs
    const { accessToken, refreshToken } = generateTokens({
      id: foundUser.id,
      emailAddress: foundUser.emailAddress,
      firstName: foundUser.firstName,
      lastName: foundUser.lastName,
      roles: foundUser.roles?.map((x) => x.code) ?? [],
      type: foundUser.emailConfirmed ? TokenType.Login : TokenType.NeedActivate,
    });

    await UserLoginHistory.create({
      userId: foundUser.id,
      accessToken,
      refreshToken,
      ipAddress: command.ipAddress,
      userAgent: command.userAgent,
    });

    return {
      ...User.getAuthDto(foundUser, accessToken),
      refreshToken,
    } as UserLoginResult;
  }
}

@RegisterValidator
export class UserLoginCommandValidator implements ICommandValidator<UserLoginCommand> {
  async validate(command: UserLoginCommand): Promise<void> {
    if (!command.emailAddress || !command.password)
      throw new BadRequestError({ message: LANG.USER_NAME_PASSWORD_MISSING_ERROR });
  }
}
