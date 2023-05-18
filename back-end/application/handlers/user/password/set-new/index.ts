import bcrypt from 'bcrypt';
import { Op } from 'sequelize';
import { TokenExpiredError } from 'jsonwebtoken';
import { User, UserForgotPassword } from '@database';
import { validatePassword } from '@libs/user/validate';
import { decodeAccessToken } from '@application/common/utils';

import {
  ICommand,
  ICommandHandler,
  ICommandValidator,
  Authorize,
  RegisterValidator,
  BadRequestError,
} from '@qnn92/mediatorts';
import LANG from '@libs/lang';
import { TokenType } from '@libs/user';

export class UserSetNewPasswordCommand implements ICommand {
  constructor(accessToken: string, password: string) {
    this.token = accessToken;
    this.password = password;
  }
  userId: number = 0;
  declare token: string;
  declare password: string;
}

@Authorize()
export class UserSetNewPasswordCommandHandler
  implements ICommandHandler<UserSetNewPasswordCommand, void>
{
  async handle(command: UserSetNewPasswordCommand): Promise<void> {
    const { userId, token } = command;

    // get ForgotPassword's request
    const ufp = await UserForgotPassword.findOne({
      where: { userId, token: token, password: { [Op.is]: null } },
      attributes: ['id', 'salt'],
    });
    if (!ufp) return;

    // hash new password
    const password = await bcrypt.hash(command.password + ufp.salt, 10);

    // update ForgotPassword's request and User's password
    await Promise.all([
      UserForgotPassword.update({ password }, { where: { id: ufp.id } }),
      User.update({ password, salt: ufp.salt }, { where: { id: userId } }),
    ]);
  }
}

@RegisterValidator
export class UserSetNewPasswordCommandValidator
  implements ICommandValidator<UserSetNewPasswordCommand>
{
  async validate(command: UserSetNewPasswordCommand): Promise<void> {
    const { password, token } = command;
    try {
      const decoded = await decodeAccessToken(token);
      if (decoded.type !== TokenType.ResetPassword.toString())
        throw new BadRequestError(LANG.USER_RESET_PASSWORD_TOKEN_INVALID_ERROR);
      command.userId = decoded.id;
    } catch (err) {
      if (err instanceof TokenExpiredError)
        throw new BadRequestError(LANG.USER_RESET_PASSWORD_TOKEN_EXPIRED_ERROR);
      throw new BadRequestError(LANG.USER_RESET_PASSWORD_TOKEN_INVALID_ERROR);
    }

    const passwordError = validatePassword(password);
    if (passwordError.length) throw new BadRequestError({ passwordError });
  }
}
