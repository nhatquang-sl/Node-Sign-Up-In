import bcrypt from 'bcrypt';
import { Op } from 'sequelize';
import { v4 as uuid } from 'uuid';
import { dbContext, initializeDb, User, UserForgotPassword } from '@database';

import { mediator } from '@application/mediator';
import { generateTokens, TokenParam } from '@application/common/utils';
import { AuthorizeBehavior } from '@application/common/behaviors';
import { UserSetNewPasswordCommand } from '.';

const userId = 1;
const { accessToken } = generateTokens({ id: userId, type: 'RESET_PASSWORD' } as TokenParam);

beforeEach(async () => {
  await dbContext.connect();
  await initializeDb();
  // create a new user
  await User.create({
    emailAddress: 'email.confirmed@yopmail.com',
    firstName: 'email',
    lastName: 'confirmed',
    password: '1234567890x@X',
    salt: uuid().split('-')[0],
    emailConfirmed: true,
    securityStamp: '',
  });

  // create a ForgetPassword's request
  await UserForgotPassword.create({
    userId,
    token: accessToken,
    salt: uuid().split('-')[0],
    ipAddress: '',
    userAgent: '',
  });
  mediator.addPipelineBehavior(new AuthorizeBehavior());
});

test('set new password success', async () => {
  // get ForgotPassword's request for compare salt
  const ufp = await UserForgotPassword.findOne({
    where: { userId, password: { [Op.is]: null } },
  });

  // set new password
  let command = new UserSetNewPasswordCommand(accessToken, '123456x@X');
  await mediator.send(command);

  // assert
  const user = await User.findOne({ where: { id: userId }, attributes: ['password', 'salt'] });
  expect(ufp?.salt).toBe(user?.salt);
  const match = await bcrypt.compare('123456x@X' + ufp?.salt, user?.password ?? '');
  expect(match).toBe(true);
});
