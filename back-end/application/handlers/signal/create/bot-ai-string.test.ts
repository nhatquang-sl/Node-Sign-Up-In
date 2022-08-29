import { Op } from 'sequelize';
import { SIGNAL_METHOD, SIGNAL_TYPE } from '@libs/constant/app-code';
import { dbContext, initializeDb, User, ISignalStrategy, ISignalSource } from '@database';

import { mediator } from '@application/mediator';
import { generateJwt } from '@application/common/utils';
import { AuthorizeBehavior } from '@application/common/behaviors';
import { SignalStrategyCreateBotAIStringCommand } from './bot-ai-string';

const { accessToken } = generateJwt({ id: 1 } as User);

beforeEach(async () => {
  await dbContext.connect();
  await initializeDb();

  mediator.addPipelineBehavior(new AuthorizeBehavior());
});

test('create bot string with two patterns - all new', async () => {
  let command = new SignalStrategyCreateBotAIStringCommand(accessToken);
  command.name = 'Pattern Bot 01';
  command.patterns = ['bbb-s', 'ssss-b'];

  const { id } = (await mediator.send(command)) as ISignalStrategy;
  const ss = await ISignalStrategy.findByPk(id, {
    include: {
      model: ISignalSource,
      as: 'sources',
      attributes: ['id', 'name', 'type', 'source'],
      where: { deletedAt: { [Op.eq]: null } },
    },
  });

  const sources = ss?.sources ?? [];
  expect(ss).not.toBeNull();
  expect(ss?.id).toBe(1);
  expect(ss?.type).toBe(SIGNAL_TYPE.BOT_AI);
  expect(ss?.method).toBe(SIGNAL_METHOD.STRING);

  expect(sources?.length).toBe(2);
  expect(sources[0].id).toBe(3);
  expect(sources[0].name).toBe('bbb-s');
  expect(sources[0].source).toBe('bbb-s');
  expect(sources[0].type).toBe(SIGNAL_TYPE.PATTERN);
  expect(sources[1].id).toBe(4);
  expect(sources[1].name).toBe('ssss-b');
  expect(sources[1].source).toBe('ssss-b');
  expect(sources[1].type).toBe(SIGNAL_TYPE.PATTERN);
});

test('create bot string with two patterns - first new', async () => {
  await ISignalSource.create({
    source: 'bbb-s',
    name: 'bbb-s',
    type: SIGNAL_TYPE.PATTERN,
  } as ISignalSource);
  let command = new SignalStrategyCreateBotAIStringCommand(accessToken);
  command.name = 'Pattern Bot 01';
  command.patterns = ['bbb-s', 'ssss-b'];

  const { id } = (await mediator.send(command)) as ISignalStrategy;
  const ss = await ISignalStrategy.findByPk(id, {
    include: {
      model: ISignalSource,
      as: 'sources',
      attributes: ['id', 'name', 'type', 'source'],
      where: { deletedAt: { [Op.eq]: null } },
    },
  });

  const sources = ss?.sources ?? [];
  expect(ss).not.toBeNull();
  expect(ss?.id).toBe(1);
  expect(ss?.type).toBe(SIGNAL_TYPE.BOT_AI);
  expect(ss?.method).toBe(SIGNAL_METHOD.STRING);

  expect(sources?.length).toBe(2);
  expect(sources[0].id).toBe(3);
  expect(sources[0].name).toBe('bbb-s');
  expect(sources[0].source).toBe('bbb-s');
  expect(sources[0].type).toBe(SIGNAL_TYPE.PATTERN);
  expect(sources[1].id).toBe(4);
  expect(sources[1].name).toBe('ssss-b');
  expect(sources[1].source).toBe('ssss-b');
  expect(sources[1].type).toBe(SIGNAL_TYPE.PATTERN);
});

test('create bot string with two patterns - second new', async () => {
  await ISignalSource.create({
    source: 'ssss-b',
    name: 'ssss-b',
    type: SIGNAL_TYPE.PATTERN,
  } as ISignalSource);
  let command = new SignalStrategyCreateBotAIStringCommand(accessToken);
  command.name = 'Pattern Bot 01';
  command.patterns = ['bbb-s', 'ssss-b'];

  const { id } = (await mediator.send(command)) as ISignalStrategy;
  const ss = await ISignalStrategy.findByPk(id, {
    include: {
      model: ISignalSource,
      as: 'sources',
      attributes: ['id', 'name', 'type', 'source'],
      where: { deletedAt: { [Op.eq]: null } },
    },
  });

  const sources = ss?.sources ?? [];
  expect(ss).not.toBeNull();
  expect(ss?.id).toBe(1);
  expect(ss?.type).toBe(SIGNAL_TYPE.BOT_AI);
  expect(ss?.method).toBe(SIGNAL_METHOD.STRING);

  expect(sources?.length).toBe(2);
  expect(sources[0].id).toBe(3);
  expect(sources[0].name).toBe('ssss-b');
  expect(sources[0].source).toBe('ssss-b');
  expect(sources[0].type).toBe(SIGNAL_TYPE.PATTERN);

  expect(sources[1].id).toBe(4);
  expect(sources[1].name).toBe('bbb-s');
  expect(sources[1].source).toBe('bbb-s');
  expect(sources[1].type).toBe(SIGNAL_TYPE.PATTERN);
});
