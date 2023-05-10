import { Kline } from '@libs/bnb';
import { mediator } from '@application/mediator';

import KLINES from './klines.json';
import { GetDivergentUpCommand } from '.';

test('get divergent up', async () => {
  const command = new GetDivergentUpCommand(KLINES);

  const kline = await mediator.send<Kline | undefined>(command);

  expect(kline).toBeUndefined();
});
