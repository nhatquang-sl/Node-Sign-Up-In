import LANG from '@libs/lang';
import { SIGNAL_METHOD, SIGNAL_TYPE } from '@libs/constant/app-code';
import { dbContext, initializeDb, User } from '@database';

import { mediator } from '@application/mediator';
import { generateJwt } from '@application/common/utils';
import { AuthorizeBehavior } from '@application/common/behaviors';
import { BadRequestError, UnauthorizedError } from '@application/common/exceptions';
import { SignalStrategyCreateCommand } from './signal-strategy';

const { accessToken } = generateJwt({ id: 1 } as User);

beforeAll(async () => {
  await dbContext.connect();
  await initializeDb();

  mediator.addPipelineBehavior(new AuthorizeBehavior());
});

test('access token missing', async () => {
  let command = new SignalStrategyCreateCommand('');

  const rejects = expect(mediator.send(command)).rejects;
  await rejects.toThrow(UnauthorizedError);
  await rejects.toThrow(JSON.stringify({ message: LANG.USER_ACCESS_TOKEN_INVALID_ERROR }));
});

test('source missing', async () => {
  let command = new SignalStrategyCreateCommand(accessToken);
  command.name = 'Supper Bot 01';
  command.type = SIGNAL_TYPE.BOT_AI;
  command.method = SIGNAL_METHOD.MIX;

  const rejects = expect(mediator.send(command)).rejects;
  await rejects.toThrow(BadRequestError);
  await rejects.toThrow(JSON.stringify({ message: LANG.SIGNAL_SOURCE_MISSING_ERROR }));
});

test('source type invalid', async () => {
  let command = new SignalStrategyCreateCommand(accessToken);
  command.name = 'Supper Bot 01';
  command.type = SIGNAL_TYPE.EXPERT;
  command.sourceIds = [1];

  const rejects = expect(mediator.send(command)).rejects;
  await rejects.toThrow(BadRequestError);
  await rejects.toThrow(JSON.stringify({ message: LANG.SIGNAL_SOURCE_MISSING_ERROR }));
});

test('source invalid', async () => {
  let command = new SignalStrategyCreateCommand(accessToken);
  command.name = 'Supper Bot 01';
  command.type = SIGNAL_TYPE.BOT_AI;
  command.method = SIGNAL_METHOD.MIX;
  command.sourceIds = [3]; // source invalid

  const rejects = expect(mediator.send(command)).rejects;
  await rejects.toThrow(BadRequestError);
  await rejects.toThrow(JSON.stringify({ message: LANG.SIGNAL_SOURCE_MISSING_ERROR }));
});

test('type invalid', async () => {
  let command = new SignalStrategyCreateCommand(accessToken);
  command.name = 'Supper Bot 01';
  command.type = SIGNAL_TYPE.PATTERN;
  command.method = SIGNAL_METHOD.MIX;
  command.sourceIds = [1];

  const rejects = expect(mediator.send(command)).rejects;
  await rejects.toThrow(BadRequestError);
  await rejects.toThrow(JSON.stringify({ message: LANG.SIGNAL_TYPE_INVALID_ERROR }));
});

test('method invalid', async () => {
  let command = new SignalStrategyCreateCommand(accessToken);
  command.name = 'Supper Bot 01';
  command.type = SIGNAL_TYPE.BOT_AI;
  command.method = SIGNAL_METHOD.STRING;
  command.sourceIds = [1];

  const rejects = expect(mediator.send(command)).rejects;
  await rejects.toThrow(BadRequestError);
  await rejects.toThrow(JSON.stringify({ message: LANG.SIGNAL_STRATEGY_INVALID_ERROR }));
});
