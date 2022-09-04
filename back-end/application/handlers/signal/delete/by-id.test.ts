import { SIGNAL_TYPE, SIGNAL_METHOD } from '@libs/constant/app-code';
import {
  dbContext,
  initializeDb,
  User,
  ISignalStrategy,
  ISignalStrategySource,
  ISignalSource,
} from '@database';

import { mediator } from '@application/mediator';
import { generateJwt } from '@application/common/utils';
import { AuthorizeBehavior } from '@application/common/behaviors';
import { SignalStrategyDeleteByIdCommand } from './by-id';

const { accessToken } = generateJwt({ id: 1 } as User);

beforeEach(async () => {
  await dbContext.connect();
  await initializeDb();
  await ISignalSource.bulkCreate([
    {
      type: SIGNAL_TYPE.EXPERT,
      name: 'ExpertNickname',
      source: '2',
    } as ISignalSource,
    {
      type: SIGNAL_TYPE.TELEGRAM,
      name: 'Telegram Channel 01',
      source: 'channel_id_01',
    } as ISignalSource,
    {
      type: SIGNAL_TYPE.TELEGRAM,
      name: 'Telegram Channel 02',
      source: 'channel_id_02',
    } as ISignalSource,
  ]);
  await ISignalStrategy.bulkCreate(
    [SIGNAL_TYPE.BOT_AI, SIGNAL_TYPE.EXPERT, SIGNAL_TYPE.TELEGRAM].map(
      (x, i) =>
        ({
          name: `${x} 0${i}`,
          type: x,
          method: x == SIGNAL_TYPE.BOT_AI ? SIGNAL_METHOD.MIX : null,
          userId: 1,
        } as ISignalStrategy)
    )
  );
  await ISignalStrategySource.bulkCreate([
    {
      SignalStrategyId: 1,
      SignalSourceId: 1,
    },
    {
      SignalStrategyId: 1,
      SignalSourceId: 2,
    },
    {
      SignalStrategyId: 2,
      SignalSourceId: 3,
    },
    {
      SignalStrategyId: 3,
      SignalSourceId: 4,
    },
    {
      SignalStrategyId: 3,
      SignalSourceId: 5,
    },
  ]);

  mediator.addPipelineBehavior(new AuthorizeBehavior());
});

test('delete a signal strategy', async () => {
  let signalStrategy = await ISignalStrategy.findByPk(1);
  expect(signalStrategy?.id).toBe(1);

  let command = new SignalStrategyDeleteByIdCommand(accessToken, 1);
  await mediator.send(command);

  signalStrategy = await ISignalStrategy.findByPk(1);
  expect(signalStrategy).toBeNull();
});
