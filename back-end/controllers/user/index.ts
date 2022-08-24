import express, { Request, Response } from 'express';
import { mediator } from '@application/mediator';
import { UserGetAllSessionCommand } from '@application/handlers/user/session/get-all';
import { getAccessToken } from '@controllers/utils';

const router = express.Router();

router.get('/sessions', async (request: Request, response: Response) => {
  response.json(await mediator.send(new UserGetAllSessionCommand(getAccessToken(request))));
});

export default router;
