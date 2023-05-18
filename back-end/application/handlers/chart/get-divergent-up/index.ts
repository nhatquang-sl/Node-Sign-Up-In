import _ from 'lodash';
import { Kline } from '@libs/bnb';
import { ICommandHandler, RegisterHandler } from '@qnn92/mediatorts';

export class GetDivergentUpCommand {
  klines: Kline[] = [];
  constructor(klines: Kline[]) {
    this.klines = klines;
  }
}

@RegisterHandler
export class GetDivergentUpCommandHandler
  implements ICommandHandler<GetDivergentUpCommand, Kline | undefined>
{
  async handle(command: GetDivergentUpCommand): Promise<Kline | undefined> {
    const { klines } = command;
    let lastOverBuy: Kline | null = null;
    let isPeak = validatePeak(klines, klines.length - 2);
    if (!isPeak) return;
    for (let i = klines.length - 2; i > 1; i--) {
      const kline = klines[i];
      const isPeak = validatePeak(klines, i);
      if (isPeak && kline.rsi > 70 && kline.high > kline.bolu) {
        lastOverBuy = kline;
        break;
      }
    }

    const curKline = klines[klines.length - 2];
    if (lastOverBuy && lastOverBuy.rsi > curKline.rsi && lastOverBuy.high < curKline.high)
      return curKline;
  }
}

const validatePeak = (klines: Kline[], i: number) => {
  const kline = klines[i];
  const preKline = klines[i - 1];
  const nextKline = klines[i + 1];
  return kline.rsi > preKline.rsi && kline.rsi > nextKline.rsi;
};
