import ENV from '@config';
import { generateActivationLink } from '@application/common/utils';
import {
  ICommandHandler,
  ICommand,
  RegisterHandler,
  RegisterValidator,
  ICommandValidator,
} from '@application/mediator';
import { NotFoundError } from '@application/common/exceptions';

import { User } from '@database';

export class UserGetActivationLinkCommand implements ICommand {
  constructor(emailAddress: string) {
    this.emailAddress = emailAddress;
  }
  declare emailAddress: string;
}

@RegisterHandler
export class UserGetActivationLinkCommandHandler
  implements ICommandHandler<UserGetActivationLinkCommand, string>
{
  async handle(command: UserGetActivationLinkCommand): Promise<string> {
    // https://sequelize.org/docs/v6/core-concepts/model-querying-finders/#findone
    console.log({ command });
    const user = await User.findOne({ where: { emailAddress: command.emailAddress } });
    console.log(user);
    if (user != null) return generateActivationLink(user.id, user.securityStamp);

    throw new NotFoundError();
  }
}

@RegisterValidator
export class UserGetActivationLinkCommandValidator
  implements ICommandValidator<UserGetActivationLinkCommand>
{
  async validate(command: UserGetActivationLinkCommand): Promise<void> {
    if (ENV.NODE_ENV !== 'development' || !command.emailAddress) throw new NotFoundError();
  }
}
