import { Kline } from '@libs/bnb';
import { mediator } from '@qnn92/mediatorts';

import KLINES from './klines.json';
import { CalculateChartCommand } from '.';

// console.log(KLINES);
beforeAll(async () => {});

test('calculate chart', async () => {
  const command = new CalculateChartCommand(KLINES);

  const klines = await mediator.send<Kline[]>(command);

  for (let i = 21; i < KLINES.length; i++) {
    expect(klines[i]).toEqual(KLINES[i]);
  }
});
