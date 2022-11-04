import { TokenData } from '@libs/user';
import { generateTokens, decodeRefreshToken } from '@application/common/utils';
import { BadRequestError, ForbiddenError } from '@application/common/exceptions';
import {
  RegisterHandler,
  RegisterValidator,
  ICommandHandler,
  ICommandValidator,
  ICommand,
} from '@application/mediator';

import { UserLoginHistory } from '@database';

export class UserRefreshTokenCommand implements ICommand {
  constructor(refreshToken: string, obj: any) {
    this.refreshToken = refreshToken;
    this.ipAddress = obj?.ipAddress;
    this.userAgent = obj?.userAgent;
  }
  refreshToken: string = '';
  ipAddress: string = '';
  userAgent: string = '';
  declare decoded: TokenData;
}

@RegisterHandler
export class UserRefreshTokenCommandHandler
  implements ICommandHandler<UserRefreshTokenCommand, string>
{
  async handle(command: UserRefreshTokenCommand): Promise<string> {
    const loginHis = await UserLoginHistory.findOne({
      where: { refreshToken: command.refreshToken },
      attributes: ['userId'],
    });
    if (!loginHis) throw new ForbiddenError();

    const { accessToken } = generateTokens(command.decoded);
    await UserLoginHistory.create({
      userId: loginHis.userId,
      accessToken,
      refreshToken: command.refreshToken,
      ipAddress: command.ipAddress,
      userAgent: command.userAgent,
    });
    return accessToken;
  }
}

@RegisterValidator
export class UserRefreshTokenCommandValidator
  implements ICommandValidator<UserRefreshTokenCommand>
{
  async validate(command: UserRefreshTokenCommand): Promise<void> {
    if (!command.refreshToken) throw new BadRequestError();
    try {
      command.decoded = await decodeRefreshToken(command.refreshToken);
    } catch (err) {
      throw new ForbiddenError();
    }
  }
}
