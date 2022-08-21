import {
  RegisterHandler,
  RegisterValidator,
  ICommandHandler,
  ICommandValidator,
  ICommand,
} from '@application/mediator';
import { BadRequestError, NotFoundError } from '@application/common/exceptions';

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
    if (!command.activationCode) throw new BadRequestError({ message: 'Missing activation code' });

    try {
      JSON.parse(Buffer.from(command.activationCode, 'base64').toString('ascii'));
    } catch (e) {
      throw new BadRequestError({ message: 'Activation code is invalid format' });
    }

    const { id, securityStamp, timestamp } = JSON.parse(
      Buffer.from(command.activationCode, 'base64').toString('ascii')
    );
    // get user by id
    let user = await User.findOne({ where: { id: id } });
    if (user == null) throw new NotFoundError({ message: 'User is not found' });

    // validate token
    const TIME_TO_LIVE = 1000 * 60 * 5;
    if (user.securityStamp != securityStamp)
      throw new BadRequestError({ message: 'Your confirm token is invalid' });

    if (new Date().getTime() - timestamp > TIME_TO_LIVE)
      throw new BadRequestError({ message: 'Your confirm token is expired' });
  }
}
