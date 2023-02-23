import UserLoginHistory from '@database/models/user-login-history';
import { Authorize, AuthorizeCommand, ICommandHandler } from '@application/mediator';

class PaginationResult<T> {
  items: T[] = [];
  page: number = 1;
  size: number = 10;
  total: number = 100;
  constructor(items: T[], page: number, size: number, total: number) {
    this.items = items;
    this.page = page;
    this.size = size;
    this.total = total;
  }
}

export class UserGetAllSessionCommand extends AuthorizeCommand {
  page: number;
  size: number;
  constructor(accessToken: string, page: number = 1, size: number = 10) {
    super(accessToken);
    this.page = page;
    this.size = size;
  }
}

@Authorize(['admin'])
export class UserGetAllSessionCommandHandler
  implements ICommandHandler<UserGetAllSessionCommand, PaginationResult<UserLoginHistory>>
{
  async handle(command: UserGetAllSessionCommand): Promise<PaginationResult<UserLoginHistory>> {
    const { page, size } = command;
    const { count, rows } = await UserLoginHistory.findAndCountAll({
      order: [['id', 'DESC']],
      offset: page,
      limit: size,
    });
    return new PaginationResult(rows, page, size, count);
  }
}
