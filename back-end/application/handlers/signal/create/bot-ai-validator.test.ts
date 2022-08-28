import LANG from '@libs/lang';
import { SIGNAL_METHOD } from '@libs/constant/app-code';
import { dbContext, initializeDb, User } from '@database';

import { mediator } from '@application/mediator';
import { generateJwt } from '@application/common/utils';
import { AuthorizeBehavior } from '@application/common/behaviors';
import { BadRequestError, UnauthorizedError } from '@application/common/exceptions';
import { SignalStrategyCreateBotAICommand } from './bot-ai';

const { accessToken } = generateJwt({ id: 1 } as User);

beforeAll(async () => {
  await dbContext.connect();
  await initializeDb();

  mediator.addPipelineBehavior(new AuthorizeBehavior());
});

test('access token required', async () => {
  let command = new SignalStrategyCreateBotAICommand('', {
    name: 'Supper Bot 01',
    method: SIGNAL_METHOD.MIX,
  });

  const rejects = expect(mediator.send(command)).rejects;
  await rejects.toThrow(UnauthorizedError);
  await rejects.toThrow(JSON.stringify({ message: LANG.USER_ACCESS_TOKEN_INVALID_ERROR }));
});

test('source required', async () => {
  let command = new SignalStrategyCreateBotAICommand(accessToken, {
    name: 'Supper Bot 01',
    method: SIGNAL_METHOD.MIX,
  });

  const rejects = expect(mediator.send(command)).rejects;
  await rejects.toThrow(BadRequestError);
  await rejects.toThrow(JSON.stringify({ message: LANG.SIGNAL_SOURCE_MISSING_ERROR }));
});

test('source invalid', async () => {
  let command = new SignalStrategyCreateBotAICommand(accessToken, {
    name: 'Supper Bot 01',
    method: SIGNAL_METHOD.MIX,
    sourceIds: [3], // source invalid
  });

  const rejects = expect(mediator.send(command)).rejects;
  await rejects.toThrow(BadRequestError);
  await rejects.toThrow(JSON.stringify({ message: LANG.SIGNAL_SOURCE_MISSING_ERROR }));
});

test('method invalid', async () => {
  let command = new SignalStrategyCreateBotAICommand(accessToken, {
    name: 'Supper Bot 01',
    method: SIGNAL_METHOD.STRING,
    sourceIds: [1], // source valid
  });

  const rejects = expect(mediator.send(command)).rejects;
  await rejects.toThrow(BadRequestError);
  await rejects.toThrow(JSON.stringify({ message: LANG.SIGNAL_STRATEGY_INVALID_ERROR }));
});
