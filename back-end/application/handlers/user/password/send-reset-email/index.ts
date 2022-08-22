import { v4 as uuid } from 'uuid';
import { Op } from 'sequelize';
import { TIMESTAMP } from '@libs/constant';
import { validateEmailAddress } from '@libs/user/validate';

import { generateJwt, sendResetPasswordEmail } from '@application/common/utils';
import { BadRequestError, NotFoundError } from '@application/common/exceptions';
import {
  RegisterHandler,
  RegisterValidator,
  ICommandHandler,
  ICommandValidator,
  ICommand,
} from '@application/mediator';

import { User, UserForgotPassword } from '@database';

export class UserSendResetPasswordEmailCommand implements ICommand {
  constructor(obj: any) {
    this.emailAddress = obj?.emailAddress;
    this.ipAddress = obj?.ipAddress;
    this.userAgent = obj?.userAgent;
  }
  emailAddress: string;
  ipAddress: string;
  userAgent: string;
  declare userId: number;
}

export class UserSendResetPasswordEmailResult {
  constructor(lastDate: number) {
    this.lastDate = lastDate;
  }
  declare lastDate: number;
}
console.log('@RegisterHandler');
@RegisterHandler
export class UserSendResetPasswordEmailCommandHandler
  implements ICommandHandler<UserSendResetPasswordEmailCommand, UserSendResetPasswordEmailResult>
{
  async handle(
    command: UserSendResetPasswordEmailCommand
  ): Promise<UserSendResetPasswordEmailResult> {
    const { userId, emailAddress, ipAddress, userAgent } = command;
    let ufp = await UserForgotPassword.findOne({
      where: {
        userId,
        password: { [Op.is]: null },
        createdAt: {
          [Op.gt]: new Date(new Date().getTime() - 5 * TIMESTAMP.MINUTE),
        },
      },
      attributes: ['createdAt'],
    });
    if (ufp != null) return new UserSendResetPasswordEmailResult(new Date(ufp.createdAt).getTime());

    // send reset password email and create a UserForgotPassword in the db
    const user = new User();
    user.id = userId;
    const { accessToken } = generateJwt(user, 'RESET_PASSWORD');
    await sendResetPasswordEmail(emailAddress, accessToken);
    ufp = await UserForgotPassword.create({
      userId: userId,
      token: accessToken,
      ipAddress,
      userAgent,
      salt: uuid().split('-')[0],
    });

    return new UserSendResetPasswordEmailResult(new Date(ufp.createdAt).getTime());
  }
}

@RegisterValidator
export class UserSendResetPasswordEmailCommandValidator
  implements ICommandValidator<UserSendResetPasswordEmailCommand>
{
  async validate(command: UserSendResetPasswordEmailCommand): Promise<void> {
    const { emailAddress } = command;
    const emailAddressError = validateEmailAddress(emailAddress);
    if (emailAddressError != undefined) throw new BadRequestError({ message: emailAddressError });

    const user = await User.findOne({
      where: { emailAddress },
      attributes: ['id', 'emailAddress', 'emailConfirmed'],
    });

    if (user === null) throw new NotFoundError({ message: `${emailAddress} not found` });
    if (!user.emailConfirmed)
      throw new BadRequestError({ message: `${emailAddress} hasn't confirmed` });
    command.userId = user.id;
  }
}
