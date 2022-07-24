import { UserLoginDto } from '@libs/user/dto';
import { dbContext, initializeDb, User, UserLoginHistory, Role } from '@database';
import { BadRequestError, UnauthorizedError } from '@controllers/exceptions';
import handleRegister from './register';
import handleLogin from './login';

const user = {
  emailAddress: 'email.confirmed@yopmail.com',
  firstName: 'email',
  lastName: 'confirmed',
  password: '123456x@X',
};

beforeAll(async () => {
  await dbContext.connect();
  await initializeDb();
  await handleRegister(user);
});

test('missing email address', async () => {
  const rejects = expect(handleLogin({ emailAddress: '', password: user.password })).rejects;
  await rejects.toThrow(BadRequestError);
  await rejects.toThrow(JSON.stringify({ message: 'Username and password are required.' }));
});

test('missing password', async () => {
  const rejects = expect(handleLogin({ emailAddress: user.emailAddress, password: '' })).rejects;
  await rejects.toThrow(BadRequestError);
  await rejects.toThrow(JSON.stringify({ message: 'Username and password are required.' }));
});

test('user does not exist', async () => {
  const { password } = user;

  const rejects = expect(handleLogin({ emailAddress: 'a@b.c', password })).rejects;
  await rejects.toThrow(UnauthorizedError);
  await rejects.toThrow(JSON.stringify({ message: 'Username or password invalid.' }));
});

test('password invalid', async () => {
  const { emailAddress } = user;

  const rejects = expect(handleLogin({ emailAddress, password: 'p' })).rejects;
  await rejects.toThrow(UnauthorizedError);
  await rejects.toThrow(JSON.stringify({ message: 'Username or password invalid.' }));
});

test('login success', async () => {
  const req = user as UserLoginDto;
  const res = await handleLogin(req);
  const { id, firstName, lastName, emailAddress, emailConfirmed } = res;

  expect(id).toBe(1);
  expect(firstName).toBe(user.firstName);
  expect(lastName).toBe(user.lastName);
  expect(emailAddress).toBe(user.emailAddress);
  expect(emailConfirmed).toBe(false);

  await validateTokens(res);
});

// validate tokens in database
const validateTokens = async (regUser: any) => {
  const { id, accessToken, refreshToken } = regUser;
  const lhUser = await UserLoginHistory.findOne({ where: { userId: id, accessToken } });
  expect(lhUser?.accessToken).toBe(accessToken);
  expect(lhUser?.refreshToken).toBe(refreshToken);

  //   TODO: need to decode and validate access and refresh tokens.
};
