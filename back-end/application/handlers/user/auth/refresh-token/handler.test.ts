import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import ENV from '@config';
import { dbContext, initializeDb, User, UserLoginHistory } from '@database';
import { BadRequestError, ForbiddenError } from '@application/common/exceptions';
import { mediator } from '@application/mediator';
import { UserRefreshTokenCommand } from '.';
import { decodeAccessToken, delay } from '@application/common/utils';

const user = {
  emailAddress: 'email.valid@yopmail.com',
  firstName: 'email',
  lastName: 'valid',
  password: '123456x@X',
};

beforeAll(async () => {
  await dbContext.connect();
  await initializeDb();

  const salt = 'salt';
  const { emailAddress, firstName, lastName } = user;
  const password = await bcrypt.hash(user.password + salt, 10);
  await User.create({
    emailAddress,
    firstName,
    lastName,
    password,
    salt,
    securityStamp: 'securityStamp',
  } as User);
});

test('refresh token missing', async () => {
  let command = new UserRefreshTokenCommand('', {});

  const rejects = expect(mediator.send(command)).rejects;
  await rejects.toThrow(BadRequestError);
  await rejects.toThrow(JSON.stringify({ message: 'Bad Request' }));
});

test('refresh token expired', async () => {
  const refreshToken = jwt.sign(user, ENV.REFRESH_TOKEN_SECRET, { expiresIn: '1s' });
  await delay(1000);

  let command = new UserRefreshTokenCommand(refreshToken, {});

  const rejects = expect(mediator.send(command)).rejects;
  await rejects.toThrow(ForbiddenError);
  await rejects.toThrow(JSON.stringify({ message: 'Forbidden' }));
});

test('refresh token not found', async () => {
  const refreshToken = jwt.sign(user, ENV.REFRESH_TOKEN_SECRET, { expiresIn: '1d' });

  let command = new UserRefreshTokenCommand(refreshToken, {});

  const rejects = expect(mediator.send(command)).rejects;
  await rejects.toThrow(ForbiddenError);
  await rejects.toThrow(JSON.stringify({ message: 'Forbidden' }));
});

test('refresh token success', async () => {
  const refreshToken = jwt.sign(
    { id: 1, roles: ['user'], type: 'LOGIN' },
    ENV.REFRESH_TOKEN_SECRET,
    { expiresIn: '1d' }
  );
  await UserLoginHistory.create({
    userId: 1,
    accessToken: 'accessToken',
    refreshToken,
    ipAddress: 'ipAddress',
    userAgent: 'userAgent',
  });
  let command = new UserRefreshTokenCommand(refreshToken, {
    ipAddress: 'ipAddress 02',
    userAgent: 'userAgent 02',
  });

  const accessToken = (await mediator.send(command)) as string;
  const { id, roles, type } = await decodeAccessToken(accessToken);

  expect(id).toBe(1);
  expect(roles).toEqual(['user']);
  expect(type).toBe('LOGIN');

  const loginHistories = await UserLoginHistory.findAll({ where: { refreshToken } });
  expect(loginHistories.length).toBe(2);
  expect(loginHistories[0].id).toBe(1);
  expect(loginHistories[0].userId).toBe(1);
  expect(loginHistories[0].ipAddress).toBe('ipAddress');
  expect(loginHistories[0].userAgent).toBe('userAgent');
  expect(loginHistories[0].accessToken).toBe('accessToken');
  expect(loginHistories[0].refreshToken).toBe(refreshToken);

  expect(loginHistories[1].id).toBe(2);
  expect(loginHistories[1].userId).toBe(1);
  expect(loginHistories[1].ipAddress).toBe('ipAddress 02');
  expect(loginHistories[1].userAgent).toBe('userAgent 02');
  expect(loginHistories[1].accessToken).toBe(accessToken);
  expect(loginHistories[1].refreshToken).toBe(refreshToken);
});
