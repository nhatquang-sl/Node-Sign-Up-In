import bcrypt from 'bcrypt';
import LANG from '@libs/lang';
import { dbContext, initializeDb, User } from '@database';
import { mediator, BadRequestError, NotFoundError } from '@qnn92/mediatorts';
import { UserActivateCommand } from '.';

const user = {
  emailAddress: 'email.valid@yopmail.com',
  firstName: 'email',
  lastName: 'valid',
  password: '123456x@X',
  securityStamp: 'securityStamp',
  salt: 'salt',
};

beforeAll(async () => {
  await dbContext.connect();
  await initializeDb();

  const { emailAddress, firstName, lastName, salt, securityStamp } = user;
  const password = await bcrypt.hash(user.password + salt, 10);
  await User.create({
    emailAddress,
    firstName,
    lastName,
    password,
    salt,
    securityStamp,
  } as User);
});

test('activation code missing', async () => {
  const command = new UserActivateCommand('');

  const rejects = expect(mediator.send(command)).rejects;
  await rejects.toThrow(BadRequestError);
  await rejects.toThrow(JSON.stringify({ message: LANG.USER_ACTIVATION_TOKEN_MISSING_ERROR }));
});

test('user not found', async () => {
  const command = new UserActivateCommand('123');

  const rejects = expect(mediator.send(command)).rejects;
  await rejects.toThrow(BadRequestError);
  await rejects.toThrow(JSON.stringify({ message: LANG.USER_ACTIVATION_TOKEN_INVALID_ERROR }));
});

test('user not found', async () => {
  const activationCode = Buffer.from(
    JSON.stringify({
      id: 0,
      securityStamp: user.securityStamp,
      timestamp: new Date().getTime(),
    })
  ).toString('base64');
  const command = new UserActivateCommand(activationCode);

  const rejects = expect(mediator.send(command)).rejects;
  await rejects.toThrow(NotFoundError);
  await rejects.toThrow(JSON.stringify({ message: LANG.USER_NOT_FOUND_ERROR }));
});

test('token invalid', async () => {
  const activationCode = Buffer.from(
    JSON.stringify({
      id: 1,
      securityStamp: user.securityStamp + '1',
      timestamp: new Date().getTime(),
    })
  ).toString('base64');
  const command = new UserActivateCommand(activationCode);

  const rejects = expect(mediator.send(command)).rejects;
  await rejects.toThrow(BadRequestError);
  await rejects.toThrow(JSON.stringify({ message: LANG.USER_ACTIVATION_TOKEN_INVALID_ERROR }));
});

test('token expired', async () => {
  const activationCode = Buffer.from(
    JSON.stringify({
      id: 1,
      securityStamp: user.securityStamp,
      timestamp: new Date().getTime() - 1000 * 60 * 6,
    })
  ).toString('base64');
  const command = new UserActivateCommand(activationCode);

  const rejects = expect(mediator.send(command)).rejects;
  await rejects.toThrow(BadRequestError);
  await rejects.toThrow(JSON.stringify({ message: LANG.USER_ACTIVATION_TOKEN_EXPIRED_ERROR }));
});

test('activate success', async () => {
  const activationCode = Buffer.from(
    JSON.stringify({
      id: 1,
      securityStamp: user.securityStamp,
      timestamp: new Date().getTime(),
    })
  ).toString('base64');
  const command = new UserActivateCommand(activationCode);

  const userNotActivated = await User.findOne({ where: { id: 1 } });
  expect(userNotActivated?.emailConfirmed).toBe(false);
  await mediator.send(command);

  const userActivated = await User.findOne({ where: { id: 1 } });
  expect(userActivated?.emailConfirmed).toBe(true);
});
