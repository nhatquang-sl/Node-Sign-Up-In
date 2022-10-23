import { getAccessToken } from '@controllers/utils';
import express, { Request, Response } from 'express';
import { mediator } from '@application/mediator';
import {
  GetOpenOrdersCommand,
  GetPositionsCommand,
  CreateOrderCommand,
  CreateListenKeyCommand,
  KeepAliveListenKeyCommand,
} from '@application/handlers/bnb';

const router = express.Router();

router.post('/order', async (request: Request, response: Response) => {
  const command = new CreateOrderCommand(getAccessToken(request), request.body);
  const res = await mediator.send(command);
  response.json(res);
});

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
