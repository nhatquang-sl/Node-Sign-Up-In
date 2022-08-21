import { User } from '@database';
import { UserAuthDto } from '@libs/user/dto';
import { Authorize, ICommandHandler, AuthorizeCommand } from '@application/mediator';
import { NotFoundError } from '@application/common/exceptions';

export class UserGetProfileCommand extends AuthorizeCommand {
  constructor(accessToken: string) {
    super(accessToken);
  }
}

@Authorize()
export class UserGetProfileCommandHandler
  implements ICommandHandler<UserGetProfileCommand, UserAuthDto>
{
  async handle(command: UserGetProfileCommand): Promise<UserAuthDto> {
    // https://sequelize.org/docs/v6/core-concepts/model-querying-finders/#findone
    const user = await User.findOne({ where: { id: command.userId } });
    if (user === null) throw new NotFoundError({ message: 'User is not found' });
    return User.getAuthDto(user);
  }
}
