import { getAccessToken } from './../utils/index';
import express, { Request, Response } from 'express';
import { mediator } from '@application/mediator';
import { GetOpenOrdersCommand } from '@application/handlers/bnb/get-open-orders';
import { GetPositionsCommand } from '@application/handlers/bnb/get-positions';
import { CreateListenKeyCommand } from '@application/handlers/bnb/listen-key/create';
import { KeepAliveListenKeyCommand } from '@application/handlers/bnb/listen-key/keep-alive';
const router = express.Router();

router.get('/openOrders/:symbol', async (request: Request, response: Response) => {
  const { symbol } = request.params;
  const command = new GetOpenOrdersCommand(getAccessToken(request), symbol);
  const orders = await mediator.send(command);
  response.json(orders);
});

router.get('/positions/:symbol', async (request: Request, response: Response) => {
  const { symbol } = request.params;
  const command = new GetPositionsCommand(getAccessToken(request), symbol);
  const orders = await mediator.send(command);
  response.json(orders);
});

router.post('/listenKey', async (request: Request, response: Response) => {
  const command = new CreateListenKeyCommand(getAccessToken(request));
  response.json(await mediator.send(command));
});

router.put('/listenKey', async (request: Request, response: Response) => {
  const command = new KeepAliveListenKeyCommand(getAccessToken(request));
  response.json(await mediator.send(command));
});

export default router;
