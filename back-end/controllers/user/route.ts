import express, { Request, Response } from 'express';
import verifyJWT from '@middleware/verify-jwt';
import handleGetUserSessions from './handlers/get-user-sessions';
const router = express.Router();

router.use(verifyJWT);
router.get('/sessions', async (request: Request, response: Response) => {
  response.json(await handleGetUserSessions());
});

export default router;
