import jwt from 'jsonwebtoken';
import ENV from '@config';
import LANG from '@libs/lang';
import { mediator } from '@application/mediator';
import { generateTokens, delay, TokenParam } from '@application/common/utils';
import { AuthorizeBehavior } from '@application/common/behaviors';
import { BadRequestError } from '@application/common/exceptions';
import { UserSetNewPasswordCommand } from '.';
import { TIMESTAMP } from '@libs/constant';

const { SECOND } = TIMESTAMP;

beforeAll(async () => {
  mediator.addPipelineBehavior(new AuthorizeBehavior());
});

test('token missing', async () => {
  let command = new UserSetNewPasswordCommand('', '');
  const rejects = expect(mediator.send(command)).rejects;
  await rejects.toThrow(BadRequestError);
  await rejects.toThrow(JSON.stringify({ message: LANG.USER_RESET_PASSWORD_TOKEN_INVALID_ERROR }));
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
  await rejects.toThrow(BadRequestError);
  await rejects.toThrow(JSON.stringify({ message: LANG.USER_RESET_PASSWORD_TOKEN_EXPIRED_ERROR }));
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
  await rejects.toThrow(BadRequestError);
  await rejects.toThrow(JSON.stringify({ message: LANG.USER_RESET_PASSWORD_TOKEN_INVALID_ERROR }));
});

test('token type invalid', async () => {
  const { accessToken } = generateTokens({} as TokenParam);

  let command = new UserSetNewPasswordCommand(accessToken, '');
  const rejects = expect(mediator.send(command)).rejects;
  await rejects.toThrow(BadRequestError);
  await rejects.toThrow(JSON.stringify({ message: LANG.USER_RESET_PASSWORD_TOKEN_INVALID_ERROR }));
});

test('password missing', async () => {
  const { accessToken } = generateTokens({ type: 'RESET_PASSWORD' } as TokenParam);

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
