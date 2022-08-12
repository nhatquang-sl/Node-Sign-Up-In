import jwt from 'jsonwebtoken';
import ENV from '@config';
import { delay } from '@controllers/auth/utils/index';
import {
  mediator,
  Authorize,
  AuthorizeCommand,
  ICommandHandler,
  Result,
} from '@application/mediator';
import { AuthorizeBehavior } from './authorize';
import { UnauthorizedError, ForbiddenError } from '../exceptions';

class TestCommand extends AuthorizeCommand {
  constructor(partyId: number, accessToken: string = '') {
    super();
    this.accessToken = accessToken;
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
    super();
    this.accessToken = accessToken;
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

beforeAll(() => {
  mediator.addPipelineBehavior(new AuthorizeBehavior());
});

test('missing access token', async () => {
  const rejects = expect(mediator.send(new TestCommand(10))).rejects;
  await rejects.toThrow(UnauthorizedError);
  await rejects.toThrow(JSON.stringify({ message: 'Invalid Token' }));
});

test('invalid access token', async () => {
  const rejects = expect(mediator.send(new TestCommand(10, 'fake access token'))).rejects;
  await rejects.toThrow(UnauthorizedError);
  await rejects.toThrow(JSON.stringify({ message: 'Invalid Token' }));
});

test('valid access token', async () => {
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

test('missing role', async () => {
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
  await rejects.toThrow(JSON.stringify({ message: 'Forbidden' }));
});

test('invalid role', async () => {
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
  await rejects.toThrow(JSON.stringify({ message: 'Forbidden' }));
});

test('valid admin role', async () => {
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

test('valid user role', async () => {
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
