import { Op } from 'sequelize';
import { dbContext, initializeDb, User, UserForgotPassword } from '@database';
import { NotFoundError, BadRequestError } from '@application/exceptions';
import { TIMESTAMP } from '@libs/constant';
import handleSendEmail from './send-email';

const userConfirmedEmail = {
  id: 1,
  emailAddress: 'email.confirmed@yopmail.com',
  firstName: 'email',
  lastName: 'confirmed',
  password: '123456x@X',
  salt: '12345678',
  emailConfirmed: true,
  securityStamp: '',
};

const userNotConfirmEmail = {
  id: 2,
  emailAddress: 'email.notConfirm@yopmail.com',
  firstName: 'email',
  lastName: 'notConfirm',
  password: '123456x@X',
  salt: '12345678',
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

test('email address timeout and create new', async () => {
  await initializeDb();
  await User.create(userConfirmedEmail);

  const startedAt = new Date().getTime();
  const { lastDate } = await handleSendEmail(userConfirmedEmail.emailAddress);
  const endedAt = new Date().getTime();

  await simulateSendEmailExpired();

  const startedAt2 = new Date().getTime();
  const result2 = await handleSendEmail(userConfirmedEmail.emailAddress);
  const endedAt2 = new Date().getTime();

  // assert
  expect(lastDate).toBeGreaterThanOrEqual(startedAt);
  expect(lastDate).toBeLessThanOrEqual(endedAt);
  expect(result2.lastDate).toBeGreaterThanOrEqual(startedAt2);
  expect(result2.lastDate).toBeLessThanOrEqual(endedAt2);
});

const simulateSendEmailExpired = async () => {
  const ufp = await UserForgotPassword.findOne({
    where: {
      userId: userConfirmedEmail.id,
      password: { [Op.is]: null },
      createdAt: {
        [Op.gt]: new Date(new Date().getTime() - TIMESTAMP.HOUR),
      },
    },
    attributes: ['id', 'createdAt'],
  });
  expect(ufp).not.toBeNull();
  UserForgotPassword.update(
    { createdAt: new Date(new Date().getTime() - TIMESTAMP.HOUR - TIMESTAMP.SECOND).toString() },
    { where: { id: ufp?.id } }
  );
};
