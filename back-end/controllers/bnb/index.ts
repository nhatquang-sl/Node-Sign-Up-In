import { getAccessToken } from './../utils/index';
import express, { Request, Response } from 'express';
import { mediator } from '@application/mediator';
import { GetOrdersCommand } from '@application/handlers/bnb/get-orders';
const router = express.Router();

router.get('/orders/:symbol', async (request: Request, response: Response) => {
  const { symbol } = request.params;
  const command = new GetOrdersCommand(getAccessToken(request), symbol);
  const orders = await mediator.send(command);
  response.json(orders);
});

export default router;
