import { Op } from 'sequelize';
import { SIGNAL_TYPE, SIGNAL_METHOD } from '@libs/constant/app-code';
import { dbContext, initializeDb, User, ISignalStrategy, ISignalSource } from '@database';

import { mediator } from '@application/mediator';
import { generateJwt } from '@application/common/utils';
import { AuthorizeBehavior } from '@application/common/behaviors';
import { SignalStrategyCreateCommand } from './signal-strategy';

const { accessToken } = generateJwt({ id: 1 } as User);

beforeEach(async () => {
  await dbContext.connect();
  await initializeDb();

  mediator.addPipelineBehavior(new AuthorizeBehavior());
});

test('create signal strategy belongs to source 1', async () => {
  // set new password
  let command = new SignalStrategyCreateCommand(accessToken);
  command.name = 'Supper Bot 01';
  command.type = SIGNAL_TYPE.BOT_AI;
  command.method = SIGNAL_METHOD.MIX;
  command.sourceIds = [1];

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

test('create signal strategy belongs to source 2', async () => {
  // set new password
  let command = new SignalStrategyCreateCommand(accessToken);
  command.name = 'Supper Bot 01';
  command.type = SIGNAL_TYPE.BOT_AI;
  command.method = SIGNAL_METHOD.MIX;
  command.sourceIds = [2];

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

test('create signal strategy belongs to two sources', async () => {
  // set new password
  let command = new SignalStrategyCreateCommand(accessToken);
  command.name = 'Supper Bot 01';
  command.type = SIGNAL_TYPE.BOT_AI;
  command.method = SIGNAL_METHOD.MIX;
  command.sourceIds = [1, 2];

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

test('create signal strategy belongs to two sources - first one is deleted', async () => {
  await ISignalSource.destroy({ where: { id: 1 } });
  let command = new SignalStrategyCreateCommand(accessToken);
  command.name = 'Supper Bot 01';
  command.type = SIGNAL_TYPE.BOT_AI;
  command.method = SIGNAL_METHOD.MIX;
  command.sourceIds = [1, 2];

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

test('create signal strategy belongs to two sources - second one is deleted', async () => {
  await ISignalSource.destroy({ where: { id: 2 } });
  let command = new SignalStrategyCreateCommand(accessToken);
  command.name = 'Supper Bot 01';
  command.type = SIGNAL_TYPE.BOT_AI;
  command.method = SIGNAL_METHOD.MIX;
  command.sourceIds = [1, 2];

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
