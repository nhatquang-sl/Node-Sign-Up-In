import bcrypt from 'bcrypt';
import { Op } from 'sequelize';
import { User, UserForgotPassword } from '@database';
import { validatePassword } from '@libs/user/validate';
import { ForbiddenError, BadRequestError } from '@application/common/exceptions';

import {
  Authorize,
  RegisterValidator,
  ICommandHandler,
  ICommandValidator,
  AuthorizeCommand,
} from '@application/mediator';

export class UserSetNewPasswordCommand extends AuthorizeCommand {
  constructor(accessToken: string, password: string) {
    super(accessToken);
    this.password = password;
  }
  declare password: string;
}

@Authorize()
export class UserSetNewPasswordCommandHandler
  implements ICommandHandler<UserSetNewPasswordCommand, void>
{
  async handle(command: UserSetNewPasswordCommand): Promise<void> {
    const { userId, accessToken } = command;

    // get ForgotPassword's request
    const ufp = await UserForgotPassword.findOne({
      where: { userId, token: accessToken, password: { [Op.is]: null } },
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
    console.log({ command });
    const { password, accessTokenType } = command;
    if (accessTokenType !== 'RESET_PASSWORD')
      throw new ForbiddenError({ message: 'Token is invalid' });

    const passwordError = validatePassword(password);
    if (passwordError.length) throw new BadRequestError({ passwordError });
  }
}
