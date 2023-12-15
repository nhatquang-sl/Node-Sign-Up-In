import LANG from '@libs/lang';
import {
  ICommand,
  ICommandHandler,
  ICommandValidator,
  RegisterHandler,
  RegisterValidator,
  BadRequestError,
  NotFoundError,
} from '@qnn92/mediatorts';

import { User } from '@database';

export class UserActivateCommand implements ICommand {
  constructor(activationCode: string) {
    this.activationCode = activationCode;
  }
  declare activationCode: string;
}

@RegisterHandler
export class UserActivateCommandHandler implements ICommandHandler<UserActivateCommand, void> {
  async handle(command: UserActivateCommand): Promise<void> {
    const { id } = JSON.parse(Buffer.from(command.activationCode, 'base64').toString('ascii'));

    // update email confirmed property
    await User.update({ emailConfirmed: true }, { where: { id: id } });
  }
}

@RegisterValidator
export class UserActivateCommandValidator implements ICommandValidator<UserActivateCommand> {
  async validate(command: UserActivateCommand): Promise<void> {
    if (!command.activationCode)
      throw new BadRequestError({ message: LANG.USER_ACTIVATION_TOKEN_MISSING_ERROR });

    try {
      JSON.parse(Buffer.from(command.activationCode, 'base64').toString('ascii'));
    } catch (e) {
      throw new BadRequestError({ message: LANG.USER_ACTIVATION_TOKEN_INVALID_ERROR });
    }

    const { id, securityStamp, timestamp } = JSON.parse(
      Buffer.from(command.activationCode, 'base64').toString('ascii')
    );
    // get user by id
    let user = await User.findOne({ where: { id: id } });
    if (user == null) throw new NotFoundError({ message: LANG.USER_NOT_FOUND_ERROR });

    // validate token
    const TIME_TO_LIVE = 1000 * 60 * 5;
    if (user.securityStamp != securityStamp)
      throw new BadRequestError({ message: LANG.USER_ACTIVATION_TOKEN_INVALID_ERROR });

    if (new Date().getTime() - timestamp > TIME_TO_LIVE)
      throw new BadRequestError({ message: LANG.USER_ACTIVATION_TOKEN_EXPIRED_ERROR });
  }
}
