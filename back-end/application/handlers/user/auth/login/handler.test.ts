import bcrypt from 'bcrypt';
import LANG from '@libs/lang';
import { dbContext, initializeDb, User, UserLoginHistory } from '@database';
import { mediator, BadRequestError, UnauthorizedError } from '@qnn92/mediatorts';
import { UserLoginCommand, UserLoginResult } from '.';

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

test('email address missing', async () => {
  let command = new UserLoginCommand(user);
  command.emailAddress = '';

  const rejects = expect(mediator.send(command)).rejects;
  await rejects.toThrow(BadRequestError);
  await rejects.toThrow(JSON.stringify({ message: LANG.USER_NAME_PASSWORD_MISSING_ERROR }));
});

test('password missing', async () => {
  let loginCommand = new UserLoginCommand(user);
  loginCommand.password = '';

  const rejects = expect(mediator.send(loginCommand)).rejects;
  await rejects.toThrow(BadRequestError);
  await rejects.toThrow(JSON.stringify({ message: LANG.USER_NAME_PASSWORD_MISSING_ERROR }));
});

test('user not found', async () => {
  let loginCommand = new UserLoginCommand(user);
  loginCommand.emailAddress = 'a@b.c';

  const rejects = expect(mediator.send(loginCommand)).rejects;
  await rejects.toThrow(UnauthorizedError);
  await rejects.toThrow(JSON.stringify({ message: LANG.USER_NAME_PASSWORD_INVALID_ERROR }));
});

test('password invalid', async () => {
  let loginCommand = new UserLoginCommand(user);
  loginCommand.password = user.password + '1';

  const rejects = expect(mediator.send(loginCommand)).rejects;
  await rejects.toThrow(UnauthorizedError);
  await rejects.toThrow(JSON.stringify({ message: LANG.USER_NAME_PASSWORD_INVALID_ERROR }));
});

test('login success', async () => {
  let loginCommand = new UserLoginCommand(user);
  const res = (await mediator.send(loginCommand)) as UserLoginResult;
  const { id, firstName, lastName, emailAddress, emailConfirmed } = res;

  expect(id).toBe(1);
  expect(firstName).toBe(user.firstName);
  expect(lastName).toBe(user.lastName);
  expect(emailAddress).toBe(user.emailAddress);
  expect(emailConfirmed).toBe(false);

  await validateTokens(res);
});

// validate tokens in database
const validateTokens = async (regUser: UserLoginResult) => {
  const { id, accessToken, refreshToken } = regUser;
  const lhUser = await UserLoginHistory.findOne({ where: { userId: id, accessToken } });
  expect(lhUser?.accessToken).toBe(accessToken);
  expect(lhUser?.refreshToken).toBe(refreshToken);

  //   TODO: need to decode and validate access and refresh tokens.
};
