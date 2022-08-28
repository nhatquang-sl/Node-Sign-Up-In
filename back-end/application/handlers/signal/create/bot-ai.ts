import { Op } from 'sequelize';
import LANG from '@libs/lang';
import { SIGNAL_TYPE, SIGNAL_METHOD } from '@libs/constant/app-code';
import { ISignalStrategy, ISignalSource, ISignalStrategySource } from '@database';
import { BadRequestError } from '@application/common/exceptions';
import {
  Authorize,
  RegisterValidator,
  ICommandHandler,
  ICommandValidator,
  AuthorizeCommand,
} from '@application/mediator';

export class SignalStrategyCreateBotAICommand extends AuthorizeCommand {
  constructor(accessToken: string, obj: any) {
    super(accessToken);
    this.name = obj?.name;
    this.method = obj?.method;
    this.sourceIds = obj?.sourceIds ?? [];
  }
  declare name: string;
  declare method: string;
  sourceIds: number[] = [];
}

@Authorize()
export class SignalStrategyCreateBotAICommandHandler
  implements ICommandHandler<SignalStrategyCreateBotAICommand, ISignalStrategy>
{
  async handle(command: SignalStrategyCreateBotAICommand): Promise<ISignalStrategy> {
    // create Signal Strategy
    const signalStrategy = await ISignalStrategy.create({
      name: command.name,
      type: SIGNAL_TYPE.BOT_AI,
      method: command.method,
    } as ISignalStrategy);

    // create relationship between Signal Strategy and Sources
    const strategySources = command.sourceIds.map((id) => ({
      SignalStrategyId: signalStrategy.id,
      SignalSourceId: id,
    }));
    await ISignalStrategySource.bulkCreate(strategySources);

    return signalStrategy;
  }
}

@RegisterValidator
export class SignalStrategyCreateBotAICommandValidator
  implements ICommandValidator<SignalStrategyCreateBotAICommand>
{
  async validate(command: SignalStrategyCreateBotAICommand): Promise<void> {
    // Signal Source is required
    if (!command.sourceIds || !command.sourceIds.length)
      throw new BadRequestError(LANG.SIGNAL_SOURCE_MISSING_ERROR);

    // Signal methods allowed
    if ([SIGNAL_METHOD.MIX, SIGNAL_METHOD.SINGLE].indexOf(command.method))
      throw new BadRequestError(LANG.SIGNAL_STRATEGY_INVALID_ERROR);

    const sources = await ISignalSource.findAll({
      where: { id: { [Op.in]: command.sourceIds }, type: SIGNAL_TYPE.BOT_AI },
      attributes: ['id'],
    });

    // Signal Source is required
    if (!sources || !sources.length) throw new BadRequestError(LANG.SIGNAL_SOURCE_MISSING_ERROR);

    command.sourceIds = sources.map((s) => s.id);
  }
}
