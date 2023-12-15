import { sendActivateEmail } from '@application/common/utils';
import { Authorize, ICommandHandler, AuthorizeCommand } from '@qnn92/mediatorts';

import { User } from '@database';

export class UserSendActivationEmailCommand extends AuthorizeCommand {
  constructor(accessToken: string) {
    super(accessToken);
  }
}

@Authorize()
export class UserSendActivationEmailCommandHandler
  implements ICommandHandler<UserSendActivationEmailCommand, void>
{
  async handle(command: UserSendActivationEmailCommand): Promise<void> {
    if (!command.userId) return;

    // https://sequelize.org/docs/v6/core-concepts/model-querying-finders/#findone
    const user = await User.findOne({ where: { id: command.userId } });
    if (user != null) await sendActivateEmail(user, user.securityStamp);
  }
}
