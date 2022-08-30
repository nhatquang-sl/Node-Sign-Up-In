import LANG from '@libs/lang';
import { REGEX } from '@libs/constant';
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

export class SignalStrategyCreateWithPatternCommand extends AuthorizeCommand {
  constructor(accessToken: string, obj: any = {}) {
    super(accessToken);
    this.name = obj?.name;
    this.patterns = obj?.patterns ?? [];
  }
  declare name: string;
  patterns: string[] = [];
}

@Authorize()
export class SignalStrategyCreateWithPatternCommandHandler
  implements ICommandHandler<SignalStrategyCreateWithPatternCommand, ISignalStrategy>
{
  async handle(command: SignalStrategyCreateWithPatternCommand): Promise<ISignalStrategy> {
    // create Signal Strategy
    const signalStrategy = await ISignalStrategy.create({
      name: command.name,
      type: SIGNAL_TYPE.BOT_AI,
      method: SIGNAL_METHOD.STRING,
    } as ISignalStrategy);

    // create relationship between Signal Strategy and Sources
    const strategySources = command.patterns.map((id) => ({
      SignalStrategyId: signalStrategy.id,
      SignalSourceId: id,
    }));
    await ISignalStrategySource.bulkCreate(strategySources);

    return signalStrategy;
  }
}

@RegisterValidator
export class SignalStrategyCreateWithPatternCommandValidator
  implements ICommandValidator<SignalStrategyCreateWithPatternCommand>
{
  async validate(command: SignalStrategyCreateWithPatternCommand): Promise<void> {
    command.patterns = command.patterns?.filter((p) => REGEX.SIGNAL_SOURCE_PATTERN.test(p));

    if (!command.patterns || !command.patterns.length)
      throw new BadRequestError(LANG.SIGNAL_SOURCE_PATTERN_MISSING_ERROR);
    let patternIds: string[] = [];
    for (const pattern of command.patterns) {
      const [source] = await ISignalSource.findOrCreate({
        where: {
          source: pattern,
          name: pattern,
          type: SIGNAL_TYPE.PATTERN,
        },
        attributes: ['id'],
      });
      patternIds.push(`${source.id}`);
    }

    command.patterns = patternIds;
  }
}
