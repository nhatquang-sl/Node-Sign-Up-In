import _ from 'lodash';
import {
  RegisterValidator,
  ICommandValidator,
  ICommandHandler,
  RegisterHandler,
} from '@application/mediator';
import { Kline } from '@libs/bnb';
import { round2Dec, round4Dec } from '@libs/utilities';

export class CalculateChartCommand {
  klines: Kline[] = [];
  constructor(klines: Kline[]) {
    this.klines = JSON.parse(JSON.stringify(klines));
  }
}

// calculate Bollinger Bands and RSI
@RegisterHandler
export class CalculateChartCommandHandler
  implements ICommandHandler<CalculateChartCommand, Kline[]>
{
  async handle(command: CalculateChartCommand): Promise<Kline[]> {
    let avgGain = -1,
      avgLoss = -1;
    const { klines } = command;
    for (let i = 1; i < klines.length; i++) {
      const kline = klines[i];
      let closeChange = parseFloat((kline.close - klines[i - 1].close).toFixed(4));
      closeChange > 0 ? (kline.gain = closeChange) : (kline.loss = Math.abs(closeChange));

      if (i > 20) {
        let sma20 = _.sumBy(_.slice(klines, i - 19, i + 1), 'close') / 20;
        const stdDev = standardDeviation(_.slice(klines, i - 19, i + 1));
        const bolu = sma20 + 2 * stdDev;
        const bold = sma20 - 2 * stdDev;
        const [rsi, gain, loss] = relativeStrengthIndex(
          _.slice(klines, i - 13, i + 1),
          avgGain,
          avgLoss
        );

        avgGain = gain;
        avgLoss = loss;

        kline.bold = round2Dec(bold);
        kline.bolu = round2Dec(bolu);
        kline.rsi = rsi;
        kline.sma20 = round2Dec(sma20);
      }
    }

    return klines;
  }
}
// https://www.wikihow.vn/T%C3%ADnh-%C4%90%E1%BB%99-l%E1%BB%87ch-Chu%E1%BA%A9n
const standardDeviation = (candles: Kline[]) => {
  const period = candles.length;
  const total = _.sumBy(candles, 'close');
  const mean = total / period;
  let variance = 0;
  candles.forEach((kline) => {
    variance += Math.pow(kline.close - mean, 2);
  });
  variance = variance / (period - 1);
  return round2Dec(Math.sqrt(variance));
};

const relativeStrengthIndex = (
  klines: Kline[],
  avgGain: number = -1,
  avgLoss: number = -1
): [number, number, number] => {
  //   console.log(avgGain, avgLoss);
  const period = klines.length;
  const kline = klines[period - 1];

  if (avgGain === -1 && avgLoss === -1) {
    avgGain = round4Dec(_.sumBy(klines, 'gain') / period);
    avgLoss = round4Dec(_.sumBy(klines, 'loss') / period);
  } else {
    avgGain = round4Dec((avgGain * (period - 1) + kline.gain) / period);
    avgLoss = round4Dec((avgLoss * (period - 1) + kline.loss) / period);
  }
  const rs = avgGain / avgLoss;
  const rsi = round2Dec(100 - 100 / (1 + rs));

  return [rsi, avgGain, avgLoss];
};

@RegisterValidator
export class CalculateChartCommandValidator implements ICommandValidator<CalculateChartCommand> {
  async validate(command: CalculateChartCommand): Promise<void> {
    // if (!command.klines?.length) throw new BadRequestError(LANG.BNB_SYMBOL_MISSING_ERROR);
  }
}
