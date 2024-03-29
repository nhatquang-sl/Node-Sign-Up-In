import jwt from 'jsonwebtoken';
import ENV from '@config';
import { User } from '@database';
import { mediator } from '@application/mediator';
import { generateJwt, delay } from '@application/common/utils';
import { AuthorizeBehavior } from '@application/common/behaviors';
import { ForbiddenError, UnauthorizedError, BadRequestError } from '@application/common/exceptions';
import { UserSetNewPasswordCommand } from '.';
import { TIMESTAMP } from '@libs/constant';

const { SECOND } = TIMESTAMP;

beforeAll(async () => {
  mediator.addPipelineBehavior(new AuthorizeBehavior());
});

test('token missing', async () => {
  let command = new UserSetNewPasswordCommand('', '');
  const rejects = expect(mediator.send(command)).rejects;
  await rejects.toThrow(UnauthorizedError);
  await rejects.toThrow(JSON.stringify({ message: `Invalid Token` }));
});

test('token expired', async () => {
  const accessToken = jwt.sign(
    {
      userId: 0,
      type: '',
    },
    ENV.ACCESS_TOKEN_SECRET,
    { expiresIn: '1s' }
  );

  await delay(2 * SECOND);

  let command = new UserSetNewPasswordCommand(accessToken, '');
  const rejects = expect(mediator.send(command)).rejects;
  await rejects.toThrow(UnauthorizedError);
  await rejects.toThrow(JSON.stringify({ message: `Invalid Token` }));
});

test('token type invalid', async () => {
  const accessToken = jwt.sign(
    {
      userId: 0,
      type: '',
    },
    ENV.ACCESS_TOKEN_SECRET,
    { expiresIn: '1m' }
  );

  let command = new UserSetNewPasswordCommand(accessToken, '');
  const rejects = expect(mediator.send(command)).rejects;
  await rejects.toThrow(ForbiddenError);
  await rejects.toThrow(JSON.stringify({ message: 'Token is invalid' }));
});

test('token type invalid', async () => {
  const { accessToken } = generateJwt({} as User, '');

  let command = new UserSetNewPasswordCommand(accessToken, '');
  const rejects = expect(mediator.send(command)).rejects;
  await rejects.toThrow(ForbiddenError);
  await rejects.toThrow(JSON.stringify({ message: 'Token is invalid' }));
});

test('password missing', async () => {
  const { accessToken } = generateJwt({} as User, 'RESET_PASSWORD');

  let command = new UserSetNewPasswordCommand(accessToken, '');
  const rejects = expect(mediator.send(command)).rejects;

  await rejects.toThrow(BadRequestError);
  await rejects.toThrow(
    JSON.stringify({
      passwordError: [
        'Password contains at least one lower character',
        'Password contains at least one upper character',
        'Password contains at least one digit character',
        'Password contains at least one special character',
        'Password contains at least 8 characters',
      ],
    })
  );
});
