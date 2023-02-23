import {
  generateTokens,
  decodeRefreshToken,
  TokenParam,
  decodeAccessToken,
} from '@application/common/utils';
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
  declare decoded: TokenParam;
}

@RegisterHandler
export class UserRefreshTokenCommandHandler
  implements ICommandHandler<UserRefreshTokenCommand, string>
{
  async handle(command: UserRefreshTokenCommand): Promise<string> {
    const loginHis = await UserLoginHistory.findOne({
      where: { refreshToken: command.refreshToken },
      attributes: ['userId', 'accessToken', 'ipAddress', 'userAgent'],
      order: [['id', 'DESC']],
    });
    if (
      !loginHis ||
      loginHis.ipAddress !== command.ipAddress ||
      loginHis.userAgent !== command.userAgent
    )
      throw new ForbiddenError();

    // access token still valid
    try {
      if (loginHis.accessToken) {
        await decodeAccessToken(loginHis.accessToken);
        return loginHis.accessToken;
      }
    } catch (err) {}

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
      const { iat, exp, ...decoded } = await decodeRefreshToken(command.refreshToken);
      command.decoded = decoded;
    } catch (err) {
      throw new ForbiddenError();
    }
  }
}
