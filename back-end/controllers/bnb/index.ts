import express, { Request, Response } from 'express';
import bnbService from '@application/services/bnb';

const router = express.Router();

router.get('/klines/:symbol/:interval', async (request: Request, response: Response) => {
  const { symbol, interval } = request.params;
  const klines = await bnbService.getKlines(symbol, interval);
  response.json(klines);
});

export default router;
