import LANG from '@libs/lang';
import { User } from '@database';

import { mediator } from '@application/mediator';
import { generateJwt } from '@application/common/utils';
import { AuthorizeBehavior } from '@application/common/behaviors';
import { BadRequestError, UnauthorizedError } from '@application/common/exceptions';
import { SignalStrategyCreateWithPatternCommand } from './signal-strategy-pattern';

const { accessToken } = generateJwt({ id: 1 } as User);

beforeAll(async () => {
  mediator.addPipelineBehavior(new AuthorizeBehavior());
});

test('access token missing', async () => {
  let command = new SignalStrategyCreateWithPatternCommand('', {});
  command.name = 'Pattern Bot 01';

  const rejects = expect(mediator.send(command)).rejects;
  await rejects.toThrow(UnauthorizedError);
  await rejects.toThrow(JSON.stringify({ message: LANG.USER_ACCESS_TOKEN_INVALID_ERROR }));
});

test('pattern missing', async () => {
  let command = new SignalStrategyCreateWithPatternCommand(accessToken);
  command.name = 'Pattern Bot 01';

  const rejects = expect(mediator.send(command)).rejects;
  await rejects.toThrow(BadRequestError);
  await rejects.toThrow(JSON.stringify({ message: LANG.SIGNAL_SOURCE_PATTERN_MISSING_ERROR }));
});

test('pattern invalid - bbb', async () => {
  let command = new SignalStrategyCreateWithPatternCommand(accessToken);
  command.name = 'Pattern Bot 01';
  command.patterns = ['bbb'];

  const rejects = expect(mediator.send(command)).rejects;
  await rejects.toThrow(BadRequestError);
  await rejects.toThrow(JSON.stringify({ message: LANG.SIGNAL_SOURCE_PATTERN_MISSING_ERROR }));
});

test('pattern invalid - abbb-s', async () => {
  let command = new SignalStrategyCreateWithPatternCommand(accessToken);
  command.name = 'Pattern Bot 01';
  command.patterns = ['abbb-s'];

  const rejects = expect(mediator.send(command)).rejects;
  await rejects.toThrow(BadRequestError);
  await rejects.toThrow(JSON.stringify({ message: LANG.SIGNAL_SOURCE_PATTERN_MISSING_ERROR }));
});
