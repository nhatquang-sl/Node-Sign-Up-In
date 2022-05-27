import express, { Request, Response } from 'express';
import verifyJWT from '@middleware/verify-jwt';
import handleRegister from './handlers/register';
import handleRegisterConfirm from './handlers/register-confirm';
import handleLogin from './handlers/login';
// import handleRefreshToken from './handlers/refresh-token';
// import handleLogout from './handlers/logout';
import handleSendActivateLink from './handlers/send-activate-link';
import handleGetProfile from './handlers/get-profile';
const router = express.Router();

router.post('/register', handleRegister);
router.get('/register-confirm/:emailActiveCode', handleRegisterConfirm);
router.post('/login', handleLogin);
// router.post('/refresh-token', handleRefreshToken);
// router.post('/logout', handleLogout);
router.use(verifyJWT);
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
