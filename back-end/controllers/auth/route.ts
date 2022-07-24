import { convertToObject } from 'typescript';
import express, { Request, Response, NextFunction } from 'express';
import verifyJWT from '@middleware/verify-jwt';

import handleRegister from './handlers/register';
import handleRegisterConfirm from './handlers/register-confirm';
import handleLogin from './handlers/login';
import handleSendActivateLink from './handlers/send-activate-link';
import handleGetProfile from './handlers/get-profile';
import { handleSendEmail, handleSetNew } from './handlers/reset-password';

const router = express.Router();

router.post('/register', async (request: Request, response: Response) => {
  const req = request.body;
  const ipAddress = request.ip;
  const userAgent = request.get('User-Agent');
  const { refreshToken, ...dto } = await handleRegister(req, ipAddress, userAgent);
  response.cookie('jwt', refreshToken, {
    httpOnly: true,
    // sameSite: 'None',
    // secure: true,
    maxAge: 24 * 60 * 60 * 1000,
  });
  response.status(201).json(dto);
});
router.get('/register-confirm/:emailActiveCode', handleRegisterConfirm);

router.post('/login', async (request: Request, response: Response) => {
  const req = request.body;
  const ipAddress = request.ip;
  const userAgent = request.get('User-Agent');
  const { refreshToken, ...dto } = await handleLogin(req, ipAddress, userAgent);
  response.cookie('jwt', refreshToken, {
    httpOnly: true,
    // sameSite: 'None',
    // secure: true,
    maxAge: 24 * 60 * 60 * 1000,
  });
  response.status(201).json(dto);
});

router.post('/reset-password/send-email', async (request: Request, response: Response) => {
  const { emailAddress } = request.body;
  const result = await handleSendEmail(emailAddress);
  response.json(result);
});

router.post('/reset-password/set-new', async (request: Request, response: Response) => {
  const { token, password } = request.body;
  response.json(await handleSetNew(token, password));
});

// router.post('/refresh-token', handleRefreshToken);
// router.post('/logout', handleLogout);
// router.use(verifyJWT);
router.post('/send-activate-link', async (request: Request, response: Response) => {
  const userId = parseInt(request.headers.userId as string);
  await handleSendActivateLink(userId);
  response.sendStatus(204); //No Content
});

router.get('/profile', async (request: Request, response: Response) => {
  const userId = parseInt(request.headers.userId as string);
  const user = await handleGetProfile(userId);
  if (!user) return response.sendStatus(404);
  response.json(user);
});

export default router;
