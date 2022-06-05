import { dbContext, initializeDb, User } from '@database';
import { NotFoundError, BadRequestError } from '@controllers/exceptions';
import handleSendEmail from './send-email';

const userConfirmedEmail = {
  emailAddress: 'email.confirmed@yopmail.com',
  firstName: 'email',
  lastName: 'confirmed',
  password: '123456x@X',
  emailConfirmed: true,
  securityStamp: '',
};

const userNotConfirmEmail = {
  emailAddress: 'email.notConfirm@yopmail.com',
  firstName: 'email',
  lastName: 'notConfirm',
  password: '123456x@X',
  emailConfirmed: false,
  securityStamp: '',
};

beforeAll(async () => {
  await dbContext.connect();
  await initializeDb();
  await User.bulkCreate([userConfirmedEmail, userNotConfirmEmail]);
});

test('email address is invalid', async () => {
  const emailAddress = 'testuser';
  const rejects = expect(handleSendEmail(emailAddress)).rejects;

  await rejects.toThrow(BadRequestError);
  await rejects.toThrow(`Email address is invalid`);
});

test('email address not found', async () => {
  const emailAddress = 'testuser@gmail.com';
  const rejects = expect(handleSendEmail(emailAddress)).rejects;

  await rejects.toThrow(NotFoundError);
  await rejects.toThrow(`${emailAddress} not found`);
});

test('email address not confirm', async () => {
  const { emailAddress } = userNotConfirmEmail;
  const rejects = expect(handleSendEmail(emailAddress)).rejects;

  // assert
  await rejects.toThrow(BadRequestError);
  await rejects.toThrow(`${emailAddress} not confirm!`);
});

test('email address confirmed', async () => {
  const startedAt = new Date().getTime();
  const { lastDate } = await handleSendEmail(userConfirmedEmail.emailAddress);
  const endedAt = new Date().getTime();

  const duplicated = await handleSendEmail(userConfirmedEmail.emailAddress);

  // assert
  expect(lastDate).toBeGreaterThanOrEqual(startedAt);
  expect(lastDate).toBeLessThanOrEqual(endedAt);
  // floor to second
  expect(Math.floor(duplicated.lastDate / 1000)).toEqual(Math.floor(lastDate / 1000));
});
