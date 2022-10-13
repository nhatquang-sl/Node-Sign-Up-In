// 3-rd parties
import _ from 'lodash';

// store
import { Kline } from 'shared/bnb';

// utilities
import { round2Dec } from 'shared/utilities';

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

export default standardDeviation;
