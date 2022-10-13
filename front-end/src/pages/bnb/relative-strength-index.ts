// 3-rd parties
import _ from 'lodash';

// store
import { Kline } from 'shared/bnb';

// utilities
import { round2Dec, round4Dec } from 'shared/utilities';

// https://school.stockcharts.com/doku.php?id=technical_indicators:relative_strength_index_rsi
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

export default relativeStrengthIndex;
