import { sendActivateEmail } from '@application/common/utils';
import { RegisterHandler, ICommandHandler, ICommand } from '@application/mediator';

import { User } from '@database';

export class UserSendActivationEmailCommand implements ICommand {
  declare userId: number;
}

@RegisterHandler
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
