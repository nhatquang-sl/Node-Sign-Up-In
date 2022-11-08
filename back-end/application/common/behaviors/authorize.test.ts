import jwt from 'jsonwebtoken';
import ENV from '@config';
import { TIMESTAMP } from '@libs/constant';
import { delay } from '@application/common/utils';
import {
  mediator,
  Authorize,
  AuthorizeCommand,
  ICommand,
  ICommandHandler,
  RegisterHandler,
  Result,
} from '@application/mediator';
import { AuthorizeBehavior } from './authorize';
import { UnauthorizedError, ForbiddenError } from '../exceptions';

class TestCommand extends AuthorizeCommand {
  constructor(partyId: number, accessToken: string = '') {
    super(accessToken);
    this.partyId = partyId;
  }
  declare partyId: number;
}

@Authorize()
export class TestCommandHandler implements ICommandHandler<TestCommand, Result> {
  async handle(command: TestCommand): Promise<Result> {
    await delay(0);
    return `message from TestCommandHandler with partyId: ${command.partyId}`;
  }
}

class TestRolesCommand extends AuthorizeCommand {
  constructor(partyId: number, accessToken: string = '') {
    super(accessToken);
    this.partyId = partyId;
  }
  declare partyId: number;
}

@Authorize(['admin', 'user'])
export class TestRolesCommandHandler implements ICommandHandler<TestRolesCommand, Result> {
  async handle(command: TestRolesCommand): Promise<Result> {
    await delay(0);
    return `message from TestRolesCommandHandler with partyId: ${command.partyId}`;
  }
}

class TestAnonymousCommand implements ICommand {}

@RegisterHandler
class TestAnonymousCommandHandler implements ICommandHandler<TestAnonymousCommand, Result> {
  async handle(command: TestAnonymousCommand): Promise<Result> {
    await delay(0);
    return `message from TestAnonymousCommand`;
  }
}

beforeAll(() => {
  mediator.addPipelineBehavior(new AuthorizeBehavior());
});

test('access token missing', async () => {
  const rejects = expect(mediator.send(new TestCommand(10))).rejects;
  await rejects.toThrow(UnauthorizedError);
  await rejects.toThrow(JSON.stringify({ message: 'Invalid Token' }));
});

test('access token invalid', async () => {
  const rejects = expect(mediator.send(new TestCommand(10, 'fake access token'))).rejects;
  await rejects.toThrow(UnauthorizedError);
  await rejects.toThrow(JSON.stringify({ message: 'Invalid Token' }));
});

test('access token expired', async () => {
  const accessToken = jwt.sign(
    {
      userId: 0,
      type: '',
    },
    ENV.ACCESS_TOKEN_SECRET,
    { expiresIn: '1s' }
  );

  await delay(2 * TIMESTAMP.SECOND);
  const rejects = expect(mediator.send(new TestCommand(10, accessToken))).rejects;
  await rejects.toThrow(UnauthorizedError);
  await rejects.toThrow(JSON.stringify({ message: 'Access Token Expired' }));
});

test('access token valid', async () => {
  const accessToken = jwt.sign(
    {
      userId: 1,
      emailConfirmed: false,
      sessionId: 10,
      roles: [],
    },
    ENV.ACCESS_TOKEN_SECRET as string,
    { expiresIn: '1d' } // 30s
  );

  const result = (await mediator.send(new TestCommand(10, accessToken))) as string;
  expect(result).toEqual('message from TestCommandHandler with partyId: 10');
});

test('role missing', async () => {
  const accessToken = jwt.sign(
    {
      userId: 1,
      emailConfirmed: false,
      sessionId: 10,
      roles: [],
    },
    ENV.ACCESS_TOKEN_SECRET,
    { expiresIn: '1d' }
  );

  const rejects = expect(mediator.send(new TestRolesCommand(10, accessToken))).rejects;
  await rejects.toThrow(ForbiddenError);
  await rejects.toThrow(JSON.stringify({ message: 'Insufficient Scope' }));
});

test('role invalid', async () => {
  const accessToken = jwt.sign(
    {
      userId: 1,
      emailConfirmed: false,
      sessionId: 10,
      roles: ['test'],
    },
    ENV.ACCESS_TOKEN_SECRET,
    { expiresIn: '1d' }
  );

  const rejects = expect(mediator.send(new TestRolesCommand(10, accessToken))).rejects;
  await rejects.toThrow(ForbiddenError);
  await rejects.toThrow(JSON.stringify({ message: 'Insufficient Scope' }));
});

test('role admin valid', async () => {
  const accessToken = jwt.sign(
    {
      userId: 1,
      emailConfirmed: false,
      sessionId: 10,
      roles: ['admin'],
    },
    ENV.ACCESS_TOKEN_SECRET,
    { expiresIn: '1d' }
  );

  const result = await mediator.send(new TestRolesCommand(10, accessToken));
  expect(result).toEqual('message from TestRolesCommandHandler with partyId: 10');
});

test('role user valid', async () => {
  const accessToken = jwt.sign(
    {
      userId: 1,
      emailConfirmed: false,
      sessionId: 10,
      roles: ['user'],
    },
    ENV.ACCESS_TOKEN_SECRET,
    { expiresIn: '1d' }
  );

  const result = await mediator.send(new TestRolesCommand(10, accessToken));
  expect(result).toEqual('message from TestRolesCommandHandler with partyId: 10');
});

test('anonymous command', async () => {
  const result = await mediator.send(new TestAnonymousCommand());
  expect(result).toEqual(`message from TestAnonymousCommand`);
});
