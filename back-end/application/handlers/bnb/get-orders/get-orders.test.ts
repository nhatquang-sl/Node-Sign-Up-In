import { v4 as uuid } from 'uuid';
import { dbContext, initializeDb, User } from '@database';

import { mediator } from '@application/mediator';
import { generateJwt } from '@application/common/utils';
import { AuthorizeBehavior } from '@application/common/behaviors';
import { GetOrdersCommand } from '.';

const userId = 1;
const { accessToken } = generateJwt({ id: userId } as User, '');

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

  mediator.addPipelineBehavior(new AuthorizeBehavior());
});

test('activate success', async () => {
  const command = new GetOrdersCommand(accessToken, 'nearusdt');

  const orders = await mediator.send(command);
  console.log({ orders });
});
