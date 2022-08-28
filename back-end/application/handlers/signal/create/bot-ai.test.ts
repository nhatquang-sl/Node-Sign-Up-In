import { Op } from 'sequelize';
import { SIGNAL_TYPE, SIGNAL_METHOD } from '@libs/constant/app-code';
import { dbContext, initializeDb, User, ISignalStrategy, ISignalSource } from '@database';

import { mediator } from '@application/mediator';
import { generateJwt } from '@application/common/utils';
import { AuthorizeBehavior } from '@application/common/behaviors';
import { SignalStrategyCreateBotAICommand } from './bot-ai';

const { accessToken } = generateJwt({ id: 1 } as User);

beforeEach(async () => {
  await dbContext.connect();
  await initializeDb();

  mediator.addPipelineBehavior(new AuthorizeBehavior());
});

test('create bot ai belongs to Bot AI 1', async () => {
  // set new password
  let command = new SignalStrategyCreateBotAICommand(accessToken, {
    name: 'Supper Bot 01',
    type: SIGNAL_TYPE.BOT_AI,
    method: SIGNAL_METHOD.MIX,
    sourceIds: [1],
  });
  const { id } = (await mediator.send(command)) as ISignalStrategy;
  const ss = await ISignalStrategy.findByPk(id, {
    include: {
      model: ISignalSource,
      as: 'sources',
      attributes: ['id', 'name', 'type'],
      where: { deletedAt: { [Op.eq]: null } },
    },
  });

  const sources = ss?.sources ?? [];
  expect(ss).not.toBeNull();
  expect(ss?.id).toBe(1);
  expect(ss?.type).toBe(SIGNAL_TYPE.BOT_AI);
  expect(ss?.method).toBe(SIGNAL_METHOD.MIX);

  expect(sources?.length).toBe(1);
  expect(sources[0].id).toBe(1);
  expect(sources[0].name).toBe('Bot AI 1');
  expect(sources[0].type).toBe(SIGNAL_TYPE.BOT_AI);
});

test('create bot ai belongs to Bot AI 2', async () => {
  // set new password
  let command = new SignalStrategyCreateBotAICommand(accessToken, {
    name: 'Supper Bot 01',
    type: SIGNAL_TYPE.BOT_AI,
    method: SIGNAL_METHOD.MIX,
    sourceIds: [2],
  });
  const { id } = (await mediator.send(command)) as ISignalStrategy;
  const ss = await ISignalStrategy.findByPk(id, {
    include: {
      model: ISignalSource,
      as: 'sources',
      attributes: ['id', 'name', 'type'],
      where: { deletedAt: { [Op.eq]: null } },
    },
  });

  const sources = ss?.sources ?? [];
  expect(ss).not.toBeNull();
  expect(ss?.id).toBe(1);
  expect(ss?.type).toBe(SIGNAL_TYPE.BOT_AI);
  expect(ss?.method).toBe(SIGNAL_METHOD.MIX);

  expect(sources?.length).toBe(1);
  expect(sources[0].id).toBe(2);
  expect(sources[0].name).toBe('Bot AI 2');
  expect(sources[0].type).toBe(SIGNAL_TYPE.BOT_AI);
});

test('create bot ai belongs to two sources', async () => {
  // set new password
  let command = new SignalStrategyCreateBotAICommand(accessToken, {
    name: 'Supper Bot 01',
    type: SIGNAL_TYPE.BOT_AI,
    method: SIGNAL_METHOD.MIX,
    sourceIds: [1, 2],
  });
  const { id } = (await mediator.send(command)) as ISignalStrategy;
  const ss = await ISignalStrategy.findByPk(id, {
    include: {
      model: ISignalSource,
      as: 'sources',
      attributes: ['id', 'name', 'type'],
      where: { deletedAt: { [Op.eq]: null } },
    },
  });

  const sources = ss?.sources ?? [];
  expect(ss).not.toBeNull();
  expect(ss?.id).toBe(1);
  expect(ss?.type).toBe(SIGNAL_TYPE.BOT_AI);
  expect(ss?.method).toBe(SIGNAL_METHOD.MIX);

  expect(sources?.length).toBe(2);
  expect(sources[0].id).toBe(1);
  expect(sources[0].name).toBe('Bot AI 1');
  expect(sources[0].type).toBe(SIGNAL_TYPE.BOT_AI);
  expect(sources[1].id).toBe(2);
  expect(sources[1].name).toBe('Bot AI 2');
  expect(sources[1].type).toBe(SIGNAL_TYPE.BOT_AI);
});

test('create bot ai belongs to two sources - first one is deleted', async () => {
  await ISignalSource.destroy({ where: { id: 1 } });
  let command = new SignalStrategyCreateBotAICommand(accessToken, {
    name: 'Supper Bot 01',
    type: SIGNAL_TYPE.BOT_AI,
    method: SIGNAL_METHOD.MIX,
    sourceIds: [1, 2],
  });

  const { id } = (await mediator.send(command)) as ISignalStrategy;
  const ss = await ISignalStrategy.findByPk(id, {
    include: {
      model: ISignalSource,
      as: 'sources',
      attributes: ['id', 'name', 'type'],
      where: { deletedAt: { [Op.eq]: null } },
    },
  });

  const sources = ss?.sources ?? [];
  expect(ss).not.toBeNull();
  expect(ss?.id).toBe(1);
  expect(ss?.type).toBe(SIGNAL_TYPE.BOT_AI);
  expect(ss?.method).toBe(SIGNAL_METHOD.MIX);

  expect(sources?.length).toBe(1);
  expect(sources[0].id).toBe(2);
  expect(sources[0].name).toBe('Bot AI 2');
  expect(sources[0].type).toBe(SIGNAL_TYPE.BOT_AI);
});

test('create bot ai belongs to two sources - second one is deleted', async () => {
  await ISignalSource.destroy({ where: { id: 2 } });
  let command = new SignalStrategyCreateBotAICommand(accessToken, {
    name: 'Supper Bot 01',
    type: SIGNAL_TYPE.BOT_AI,
    method: SIGNAL_METHOD.MIX,
    sourceIds: [1, 2],
  });

  const { id } = (await mediator.send(command)) as ISignalStrategy;
  const ss = await ISignalStrategy.findByPk(id, {
    include: {
      model: ISignalSource,
      as: 'sources',
      attributes: ['id', 'name', 'type'],
      where: { deletedAt: { [Op.eq]: null } },
    },
  });

  const sources = ss?.sources ?? [];
  expect(ss).not.toBeNull();
  expect(ss?.id).toBe(1);
  expect(ss?.type).toBe(SIGNAL_TYPE.BOT_AI);
  expect(ss?.method).toBe(SIGNAL_METHOD.MIX);

  expect(sources?.length).toBe(1);
  expect(sources[0].id).toBe(1);
  expect(sources[0].name).toBe('Bot AI 1');
  expect(sources[0].type).toBe(SIGNAL_TYPE.BOT_AI);
});
