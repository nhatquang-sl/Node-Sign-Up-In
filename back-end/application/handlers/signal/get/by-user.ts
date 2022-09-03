import { Op } from 'sequelize';
import { ISignalStrategy, ISignalSource } from '@database';
import { Authorize, ICommandHandler, AuthorizeCommand } from '@application/mediator';

export class SignalStrategyGetByUserCommand extends AuthorizeCommand {
  constructor(accessToken: string, page: number = 0, size: number = 20, type: string = '') {
    super(accessToken);
    this.page = page;
    this.size = size;
    this.type = type;
  }
  declare page: number;
  declare size: number;
  declare type: string;
}

@Authorize()
export class SignalStrategyGetByUserCommandHandler
  implements
    ICommandHandler<SignalStrategyGetByUserCommand, { rows: ISignalStrategy[]; count: number }>
{
  async handle(
    command: SignalStrategyGetByUserCommand
  ): Promise<{ rows: ISignalStrategy[]; count: number }> {
    const { count, rows } = await ISignalStrategy.findAndCountAll({
      where: { ...{ userId: command.userId }, ...(command.type ? { type: command.type } : {}) },
      include: {
        model: ISignalSource,
        as: 'sources',
        attributes: ['id', 'name', 'type'],
        where: { deletedAt: { [Op.eq]: null } },
      },
      offset: command.page < 0 ? 0 : command.page,
      limit: command.size,
      distinct: true, // https://github.com/sequelize/sequelize/issues/10557
      // paranoid: false, // This will also retrieve soft-deleted records
    });
    console.log(count);
    return { rows, count };
  }
}
