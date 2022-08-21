import bcrypt from 'bcrypt';
import { UserLoginDto, UserAuthDto } from '@libs/user/dto';

import { generateJwt } from '@application/common/utils';
import { BadRequestError, UnauthorizedError } from '@application/common/exceptions';
import {
  RegisterHandler,
  RegisterValidator,
  ICommandHandler,
  ICommandValidator,
  ICommand,
} from '@application/mediator';

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
    if (!foundUser) throw new UnauthorizedError({ message: 'Username or password invalid' });

    // Evaluate password
    const match = await bcrypt.compare(command.password + foundUser.salt, foundUser.password);
    if (!match) throw new UnauthorizedError({ message: 'Username or password invalid' });

    // Create JWTs
    const { accessToken, refreshToken } = generateJwt(foundUser, 'LOGIN');
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
      throw new BadRequestError({ message: 'Username and password are required' });
  }
}
