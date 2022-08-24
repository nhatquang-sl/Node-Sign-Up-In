import UserLoginHistory from '@database/models/user-login-history';
import { Authorize, AuthorizeCommand, ICommandHandler } from '@application/mediator';

export class UserGetAllSessionCommand extends AuthorizeCommand {
  constructor(accessToken: string) {
    super(accessToken);
  }
}

@Authorize(['admin'])
export class UserGetAllSessionCommandHandler
  implements ICommandHandler<UserGetAllSessionCommand, UserLoginHistory[]>
{
  async handle(command: UserGetAllSessionCommand): Promise<UserLoginHistory[]> {
    return await UserLoginHistory.findAll();
  }
}
