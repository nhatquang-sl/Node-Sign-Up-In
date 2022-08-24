import LANG from '@libs/lang';
import { dbContext, initializeDb, User } from '@database';
import { mediator } from '@application/mediator';
import { NotFoundError, BadRequestError } from '@application/common/exceptions';
import { UserSendResetPasswordEmailCommand } from '.';

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

test('email address invalid', async () => {
  let command = new UserSendResetPasswordEmailCommand({ emailAddress: 'test.user' });
  const rejects = expect(mediator.send(command)).rejects;

  await rejects.toThrow(BadRequestError);
  await rejects.toThrow(JSON.stringify({ message: LANG.USER_EMAIL_ADDRESS_INVALID_ERROR }));
});

test('email address not found', async () => {
  let command = new UserSendResetPasswordEmailCommand({ emailAddress: 'test.user@gmail.com' });
  const rejects = expect(mediator.send(command)).rejects;

  await rejects.toThrow(NotFoundError);
  await rejects.toThrow(JSON.stringify({ message: LANG.USER_NOT_FOUND_ERROR }));
});

test("email address hasn't confirmed", async () => {
  const { emailAddress } = userNotConfirmEmail;
  let command = new UserSendResetPasswordEmailCommand({ emailAddress });
  const rejects = expect(mediator.send(command)).rejects;

  // assert
  await rejects.toThrow(BadRequestError);
  await rejects.toThrow(JSON.stringify({ message: LANG.USER_EMAIL_ACTIVATION_ERROR }));
});
