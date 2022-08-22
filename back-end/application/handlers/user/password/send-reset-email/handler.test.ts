import { Op } from 'sequelize';
import { dbContext, initializeDb, User, UserForgotPassword } from '@database';
import { TIMESTAMP } from '@libs/constant';
import { mediator } from '@application/mediator';
import { UserSendResetPasswordEmailCommand, UserSendResetPasswordEmailResult } from '.';

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

beforeEach(async () => {
  await dbContext.connect();
  await initializeDb();
  await User.bulkCreate([userConfirmedEmail, userNotConfirmEmail]);
});

test('email address confirmed', async () => {
  const { emailAddress } = userConfirmedEmail;
  // track time BEFORE SendResetPasswordEmail
  const startedAt = new Date().getTime();

  let command = new UserSendResetPasswordEmailCommand({ emailAddress });
  const { lastDate } = (await mediator.send(command)) as UserSendResetPasswordEmailResult;

  // track time AFTER SendResetPasswordEmail
  const endedAt = new Date().getTime();

  command = new UserSendResetPasswordEmailCommand({ emailAddress });
  const duplicated = (await mediator.send(command)) as UserSendResetPasswordEmailResult;

  // assert
  expect(lastDate).toBeGreaterThanOrEqual(startedAt);
  expect(lastDate).toBeLessThanOrEqual(endedAt);

  // floor to second
  expect(Math.floor(duplicated.lastDate / TIMESTAMP.SECOND)).toEqual(
    Math.floor(lastDate / TIMESTAMP.SECOND)
  );
});

test('email address timeout and create new', async () => {
  const { emailAddress } = userConfirmedEmail;
  const startedAt = new Date().getTime();
  let command = new UserSendResetPasswordEmailCommand({ emailAddress });
  const { lastDate } = (await mediator.send(command)) as UserSendResetPasswordEmailResult;
  const endedAt = new Date().getTime();

  await simulateSendEmailExpired();

  const startedAt2 = new Date().getTime();
  const result2 = (await mediator.send(command)) as UserSendResetPasswordEmailResult;
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
