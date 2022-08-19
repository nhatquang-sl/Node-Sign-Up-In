import bcrypt from 'bcrypt';
import { dbContext, initializeDb, User, UserForgotPassword } from '@database';
import { UnauthorizedError, BadRequestError } from '@application/exceptions';
import handleSendEmail from './send-email';
import handleSetNew from './set-new';
import { Op } from 'sequelize';

let userConfirmedEmail = {
  id: 1,
  emailAddress: 'email.confirmed@yopmail.com',
  firstName: 'email',
  lastName: 'confirmed',
  password: '123456x@X',
  salt: '12345678',
  emailConfirmed: true,
  securityStamp: '',
};

beforeAll(async () => {
  await dbContext.connect();
  await initializeDb();
  userConfirmedEmail = await User.create(userConfirmedEmail as User);
});

test('validate new password', async () => {
  const rejects = expect(handleSetNew('', '')).rejects;
  await rejects.toThrow(BadRequestError);
  await rejects.toThrow(`Password contains at least one lower character`);
});

test('validate token', async () => {
  const rejects = expect(handleSetNew('', 'P@ssw0rd1234')).rejects;
  await rejects.toThrow(UnauthorizedError);
  await rejects.toThrow('Invalid Token');
});

test('set new password success', async () => {
  // send email reset password
  const { id, emailAddress } = userConfirmedEmail;
  const startedAt = new Date().getTime();
  const { lastDate } = await handleSendEmail(emailAddress);
  const endedAt = new Date().getTime();

  // set new password
  const ufp = await UserForgotPassword.findOne({
    where: { userId: id, password: { [Op.is]: null } },
  });
  await handleSetNew(ufp?.token ?? '', 'P@ssw0rd1234');
  const user = await User.findOne({ where: { id }, attributes: ['password', 'salt'] });

  // assert
  expect(ufp?.salt).toBe(user?.salt);
  expect(lastDate).toBeGreaterThanOrEqual(startedAt);
  expect(lastDate).toBeLessThanOrEqual(endedAt);
  const match = await bcrypt.compare('P@ssw0rd1234' + ufp?.salt, user?.password ?? '');
  expect(match).toBe(true);
});
