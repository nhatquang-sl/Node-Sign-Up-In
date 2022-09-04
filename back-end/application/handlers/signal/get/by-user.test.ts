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
import { SignalStrategyGetByUserCommand } from './by-user';

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

test('get all 3 signal strategies', async () => {
  let command = new SignalStrategyGetByUserCommand(accessToken);
  command.page = 0;
  command.size = 10;
  const { rows, count } = (await mediator.send(command)) as {
    rows: ISignalStrategy[];
    count: number;
  };

  expect(count).toBe(3);
  // verify bot ai
  expect(rows[0].userId).toBe(1);
  expect(rows[0].id).toBe(1);
  expect(rows[0].name).toBe('BOT_AI 00');
  expect(rows[0].type).toBe(SIGNAL_TYPE.BOT_AI);
  expect(rows[0].method).toBe(SIGNAL_METHOD.MIX);
  expect(rows[0].createdAt).not.toBeNull();
  expect(rows[0].updatedAt).not.toBeNull();
  expect(rows[0].deletedAt).toBeNull();
  expect(rows[0].sources).not.toBeNull();
  expect(rows[0].sources?.length).toBe(2);
  let sources = rows[0].sources ?? [];
  expect(sources[0].id).toBe(1);
  expect(sources[0].name).toBe('Bot AI 1');
  expect(sources[0].type).toBe(SIGNAL_TYPE.BOT_AI);
  expect(sources[1].id).toBe(2);
  expect(sources[1].name).toBe('Bot AI 2');
  expect(sources[1].type).toBe(SIGNAL_TYPE.BOT_AI);

  // verify expert
  expect(rows[1].userId).toBe(1);
  expect(rows[1].id).toBe(2);
  expect(rows[1].name).toBe('EXPERT 01');
  expect(rows[1].type).toBe(SIGNAL_TYPE.EXPERT);
  expect(rows[1].method).toBeNull();
  expect(rows[1].createdAt).not.toBeNull();
  expect(rows[1].updatedAt).not.toBeNull();
  expect(rows[1].deletedAt).toBeNull();
  expect(rows[1].sources).not.toBeNull();
  expect(rows[1].sources?.length).toBe(1);
  sources = rows[1].sources ?? [];
  expect(sources[0].id).toBe(3);
  expect(sources[0].name).toBe('ExpertNickname');
  expect(sources[0].type).toBe(SIGNAL_TYPE.EXPERT);

  // telegram
  expect(rows[2].userId).toBe(1);
  expect(rows[2].id).toBe(3);
  expect(rows[2].name).toBe('TELEGRAM 02');
  expect(rows[2].type).toBe(SIGNAL_TYPE.TELEGRAM);
  expect(rows[2].method).toBeNull();
  expect(rows[2].createdAt).not.toBeNull();
  expect(rows[2].updatedAt).not.toBeNull();
  expect(rows[2].deletedAt).toBeNull();
  expect(rows[2].sources).not.toBeNull();
  expect(rows[2].sources?.length).toBe(2);
  sources = rows[2].sources ?? [];
  expect(sources[0].id).toBe(4);
  expect(sources[0].name).toBe('Telegram Channel 01');
  expect(sources[0].type).toBe(SIGNAL_TYPE.TELEGRAM);
  expect(sources[1].id).toBe(5);
  expect(sources[1].name).toBe('Telegram Channel 02');
  expect(sources[1].type).toBe(SIGNAL_TYPE.TELEGRAM);
});

test('get all 3 signal strategies - one strategy deleted', async () => {
  await ISignalStrategy.destroy({ where: { id: 1 } });
  let command = new SignalStrategyGetByUserCommand(accessToken);
  command.page = 0;
  command.size = 10;
  const { rows, count } = (await mediator.send(command)) as {
    rows: ISignalStrategy[];
    count: number;
  };

  // verify expert
  expect(count).toBe(2);
  expect(rows[0].userId).toBe(1);
  expect(rows[0].id).toBe(2);
  expect(rows[0].name).toBe('EXPERT 01');
  expect(rows[0].type).toBe(SIGNAL_TYPE.EXPERT);
  expect(rows[0].method).toBeNull();
  expect(rows[0].createdAt).not.toBeNull();
  expect(rows[0].updatedAt).not.toBeNull();
  expect(rows[0].deletedAt).toBeNull();
  expect(rows[0].sources).not.toBeNull();
  expect(rows[0].sources?.length).toBe(1);
  let sources = rows[0].sources ?? [];
  expect(sources[0].id).toBe(3);
  expect(sources[0].name).toBe('ExpertNickname');
  expect(sources[0].type).toBe(SIGNAL_TYPE.EXPERT);

  // verify telegram
  expect(rows[1].userId).toBe(1);
  expect(rows[1].id).toBe(3);
  expect(rows[1].name).toBe('TELEGRAM 02');
  expect(rows[1].type).toBe(SIGNAL_TYPE.TELEGRAM);
  expect(rows[1].method).toBeNull();
  expect(rows[1].createdAt).not.toBeNull();
  expect(rows[1].updatedAt).not.toBeNull();
  expect(rows[1].deletedAt).toBeNull();
  expect(rows[1].sources).not.toBeNull();
  expect(rows[1].sources?.length).toBe(2);
  sources = rows[1].sources ?? [];
  expect(sources[0].id).toBe(4);
  expect(sources[0].name).toBe('Telegram Channel 01');
  expect(sources[0].type).toBe(SIGNAL_TYPE.TELEGRAM);
  expect(sources[1].id).toBe(5);
  expect(sources[1].name).toBe('Telegram Channel 02');
  expect(sources[1].type).toBe(SIGNAL_TYPE.TELEGRAM);
});

test('get all 3 signal strategies - one source deleted', async () => {
  await ISignalSource.destroy({ where: { id: 2 } });
  let command = new SignalStrategyGetByUserCommand(accessToken);
  command.page = 0;
  command.size = 10;
  const { rows, count } = (await mediator.send(command)) as {
    rows: ISignalStrategy[];
    count: number;
  };

  expect(count).toBe(3);
  // verify bot ai
  expect(rows[0].userId).toBe(1);
  expect(rows[0].id).toBe(1);
  expect(rows[0].name).toBe('BOT_AI 00');
  expect(rows[0].type).toBe(SIGNAL_TYPE.BOT_AI);
  expect(rows[0].method).toBe(SIGNAL_METHOD.MIX);
  expect(rows[0].createdAt).not.toBeNull();
  expect(rows[0].updatedAt).not.toBeNull();
  expect(rows[0].deletedAt).toBeNull();
  expect(rows[0].sources).not.toBeNull();
  expect(rows[0].sources?.length).toBe(1);
  let sources = rows[0].sources ?? [];
  expect(sources[0].id).toBe(1);
  expect(sources[0].name).toBe('Bot AI 1');
  expect(sources[0].type).toBe(SIGNAL_TYPE.BOT_AI);

  // verify expert
  expect(rows[1].userId).toBe(1);
  expect(rows[1].id).toBe(2);
  expect(rows[1].name).toBe('EXPERT 01');
  expect(rows[1].type).toBe(SIGNAL_TYPE.EXPERT);
  expect(rows[1].method).toBeNull();
  expect(rows[1].createdAt).not.toBeNull();
  expect(rows[1].updatedAt).not.toBeNull();
  expect(rows[1].deletedAt).toBeNull();
  expect(rows[1].sources).not.toBeNull();
  expect(rows[1].sources?.length).toBe(1);
  sources = rows[1].sources ?? [];
  expect(sources[0].id).toBe(3);
  expect(sources[0].name).toBe('ExpertNickname');
  expect(sources[0].type).toBe(SIGNAL_TYPE.EXPERT);

  // telegram
  expect(rows[2].userId).toBe(1);
  expect(rows[2].id).toBe(3);
  expect(rows[2].name).toBe('TELEGRAM 02');
  expect(rows[2].type).toBe(SIGNAL_TYPE.TELEGRAM);
  expect(rows[2].method).toBeNull();
  expect(rows[2].createdAt).not.toBeNull();
  expect(rows[2].updatedAt).not.toBeNull();
  expect(rows[2].deletedAt).toBeNull();
  expect(rows[2].sources).not.toBeNull();
  expect(rows[2].sources?.length).toBe(2);
  sources = rows[2].sources ?? [];
  expect(sources[0].id).toBe(4);
  expect(sources[0].name).toBe('Telegram Channel 01');
  expect(sources[0].type).toBe(SIGNAL_TYPE.TELEGRAM);
  expect(sources[1].id).toBe(5);
  expect(sources[1].name).toBe('Telegram Channel 02');
  expect(sources[1].type).toBe(SIGNAL_TYPE.TELEGRAM);
});

test('get signal strategies with type = "EXPERT"', async () => {
  let command = new SignalStrategyGetByUserCommand(accessToken);
  command.page = 0;
  command.size = 10;
  command.type = SIGNAL_TYPE.EXPERT;
  const { rows, count } = (await mediator.send(command)) as {
    rows: ISignalStrategy[];
    count: number;
  };

  expect(count).toBe(1);
  // console.log(JSON.parse(JSON.stringify(rows[0])));
  expect(rows[0].userId).toBe(1);
  expect(rows[0].id).toBe(2);
  expect(rows[0].name).toBe('EXPERT 01');
  expect(rows[0].type).toBe(SIGNAL_TYPE.EXPERT);
  expect(rows[0].method).toBeNull();
  expect(rows[0].createdAt).not.toBeNull();
  expect(rows[0].updatedAt).not.toBeNull();
  expect(rows[0].deletedAt).toBeNull();
  expect(rows[0].sources).not.toBeNull();
  expect(rows[0].sources?.length).toBe(1);
  let sources = rows[0].sources ?? [];
  expect(sources[0].id).toBe(3);
  expect(sources[0].name).toBe('ExpertNickname');
  expect(sources[0].type).toBe(SIGNAL_TYPE.EXPERT);
});

test('get signal strategies with type = "BOT_AI"', async () => {
  let command = new SignalStrategyGetByUserCommand(accessToken);
  command.page = 0;
  command.size = 10;
  command.type = SIGNAL_TYPE.BOT_AI;
  const { rows, count } = (await mediator.send(command)) as {
    rows: ISignalStrategy[];
    count: number;
  };

  expect(count).toBe(1);
  // console.log(JSON.parse(JSON.stringify(rows[0])));
  expect(rows[0].userId).toBe(1);
  expect(rows[0].id).toBe(1);
  expect(rows[0].name).toBe('BOT_AI 00');
  expect(rows[0].type).toBe(SIGNAL_TYPE.BOT_AI);
  expect(rows[0].method).toBe(SIGNAL_METHOD.MIX);
  expect(rows[0].createdAt).not.toBeNull();
  expect(rows[0].updatedAt).not.toBeNull();
  expect(rows[0].deletedAt).toBeNull();
  expect(rows[0].sources).not.toBeNull();
  expect(rows[0].sources?.length).toBe(2);
  let sources = rows[0].sources ?? [];
  expect(sources[0].id).toBe(1);
  expect(sources[0].name).toBe('Bot AI 1');
  expect(sources[0].type).toBe(SIGNAL_TYPE.BOT_AI);
  expect(sources[1].id).toBe(2);
  expect(sources[1].name).toBe('Bot AI 2');
  expect(sources[1].type).toBe(SIGNAL_TYPE.BOT_AI);
});

test('get signal strategies with type = "TELEGRAM"', async () => {
  let command = new SignalStrategyGetByUserCommand(accessToken);
  command.page = 0;
  command.size = 10;
  command.type = SIGNAL_TYPE.TELEGRAM;
  const { rows, count } = (await mediator.send(command)) as {
    rows: ISignalStrategy[];
    count: number;
  };

  expect(count).toBe(1);
  // console.log(JSON.parse(JSON.stringify(rows[0])));
  expect(rows[0].userId).toBe(1);
  expect(rows[0].id).toBe(3);
  expect(rows[0].name).toBe('TELEGRAM 02');
  expect(rows[0].type).toBe(SIGNAL_TYPE.TELEGRAM);
  expect(rows[0].method).toBeNull();
  expect(rows[0].createdAt).not.toBeNull();
  expect(rows[0].updatedAt).not.toBeNull();
  expect(rows[0].deletedAt).toBeNull();
  expect(rows[0].sources).not.toBeNull();
  expect(rows[0].sources?.length).toBe(2);
  let sources = rows[0].sources ?? [];
  expect(sources[0].id).toBe(4);
  expect(sources[0].name).toBe('Telegram Channel 01');
  expect(sources[0].type).toBe(SIGNAL_TYPE.TELEGRAM);
  expect(sources[1].id).toBe(5);
  expect(sources[1].name).toBe('Telegram Channel 02');
  expect(sources[1].type).toBe(SIGNAL_TYPE.TELEGRAM);
});
