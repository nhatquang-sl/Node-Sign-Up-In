import express, { Request, Response } from 'express';
import { mediator } from '@application/mediator';
import { UserGetAllSessionCommand } from '@application/handlers/user/session/get-all';
import { getAccessToken } from '@controllers/utils';

const router = express.Router();

router.get('/sessions', async (request: Request, response: Response) => {
  const { page, size } = request.query as { page: string; size: string };
  response.json(
    await mediator.send(
      new UserGetAllSessionCommand(getAccessToken(request), parseInt(page), parseInt(size))
    )
  );
});

export default router;
