import { ISignalStrategy } from '@database';
import { Authorize, ICommandHandler, AuthorizeCommand } from '@application/mediator';

export class SignalStrategyDeleteByIdCommand extends AuthorizeCommand {
  constructor(accessToken: string, strategyId: number) {
    super(accessToken);
    this.strategyId = strategyId;
  }
  declare strategyId: number;
}

@Authorize()
export class SignalStrategyDeleteByIdCommandHandler
  implements ICommandHandler<SignalStrategyDeleteByIdCommand, void>
{
  async handle(command: SignalStrategyDeleteByIdCommand): Promise<void> {
    await ISignalStrategy.destroy({ where: { id: command.strategyId } });
  }
}
