import express, { Request, Response } from 'express';

import { mediator } from '@application/mediator';
import { UserRegisterCommand, UserRegisterResult } from '@application/handlers/user/auth/register';
import { UserActivateCommand } from '@application/handlers/user/auth/activate';
import { UserLoginCommand, UserLoginResult } from '@application/handlers/user/auth/login';
import { UserSendActivationEmailCommand } from '@application/handlers/user/auth/send-activation-email';
import { UserGetProfileCommand } from '@application/handlers/user/profile/get';
import { UserGetActivationLinkCommand } from '@application/handlers/user/auth/get-activation-link';
import { UserRefreshTokenCommand } from '@application/handlers/user/auth/refresh-token';
import {
  UserSendResetPasswordEmailCommand,
  UserSetNewPasswordCommand,
} from '@application/handlers/user/password';
import { getAccessToken } from '@controllers/utils';
const router = express.Router();

router.post('/register', async (request: Request, response: Response) => {
  console.log('UserRegisterCommand');
  let command = new UserRegisterCommand({
    ...request.body,
    ipAddress: request.ip,
    userAgent: request.get('User-Agent'),
  });

  const { refreshToken, ...dto } = (await mediator.send(command)) as UserRegisterResult;
  response.cookie('jwt', refreshToken, {
    httpOnly: true,
    // sameSite: 'None',
    // secure: true,
    maxAge: 24 * 60 * 60 * 1000,
  });
  response.status(201).json(dto);
});

router.get('/activate/:activationCode', async (request: Request, response: Response) => {
  const command = new UserActivateCommand(request.params.activationCode);
  await mediator.send(command);
  return response.sendStatus(204);
});

router.post('/login', async (request: Request, response: Response) => {
  let command = new UserLoginCommand({
    ...request.body,
    ipAddress: request.ip,
    userAgent: request.get('User-Agent'),
  });

  const { refreshToken, ...dto } = (await mediator.send(command)) as UserLoginResult;
  response.cookie('jwt', refreshToken, {
    httpOnly: true,
    // sameSite: 'None',
    // secure: true,
    maxAge: 24 * 60 * 60 * 1000,
  });
  response.status(201).json(dto);
});

router.post('/send-activation-email', async (request: Request, response: Response) => {
  const command = new UserSendActivationEmailCommand(getAccessToken(request));
  await mediator.send(command);
  response.sendStatus(204); //No Content
});

router.get('/activation-link/:emailAddress', async (request: Request, response: Response) => {
  const command = new UserGetActivationLinkCommand(request.params.emailAddress);
  response.json(await mediator.send(command));
});

router.get('/profile', async (request: Request, response: Response) => {
  const command = new UserGetProfileCommand(getAccessToken(request));
  const { ...dto } = (await mediator.send(command)) as UserLoginResult;
  response.json(dto);
});

router.post('/reset-password/send-email', async (request: Request, response: Response) => {
  const { emailAddress } = request.body;
  const command = new UserSendResetPasswordEmailCommand({
    emailAddress,
    ipAddress: request.ip,
    userAgent: request.get('User-Agent'),
  });
  response.json(await mediator.send(command));
});

router.post('/reset-password/set-new', async (request: Request, response: Response) => {
  const { token, password } = request.body;
  const command = new UserSetNewPasswordCommand(token, password);
  response.json(await mediator.send(command));
});

router.get('/refresh-token', async (request: Request, response: Response) => {
  console.log(JSON.stringify(request.cookies));
  const command = new UserRefreshTokenCommand(request.cookies['jwt'], request);
  response.json({ accessToken: await mediator.send(command) });
});

router.get('/log-out', async (request: Request, response: Response) => {
  response.clearCookie('jwt', { httpOnly: true });
  response.sendStatus(204);
});

export default router;
