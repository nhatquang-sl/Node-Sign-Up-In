import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import _ from 'lodash';
import { TableCell, TableRow } from '@mui/material';

import { selectSymbol } from 'store/bnb-slice';
import { formatDateNumber, round2Dec } from 'shared/utilities';
import { bnbService, Kline } from 'shared/bnb';

import standardDeviation from './standard-deviation';
import relativeStrengthIndex from './relative-strength-index';
import { Indicator } from './types';
import { HOUR, SECOND } from 'shared/constant/timestamp';

const IndicatorRow = ({ interval }: { interval: string }) => {
  const symbol = useSelector(selectSymbol);

  const [indicator, setIndicator] = useState(new Indicator(interval));

  const getAndCalculateKlines = useCallback(async () => {
    const klines = await bnbService.getKlines(symbol, interval);
    calculateChart(klines, interval);
  }, [symbol, interval]);

  const calculateChart = (klines: Kline[], interval: string) => {
    let avgGain = -1,
      avgLoss = -1;
    const indicators: Indicator[] = [];
    let indicator = new Indicator(interval);
    for (let i = 1; i < klines.length; i++) {
      indicator = new Indicator(interval);
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

        kline.bold = indicator.bold = round2Dec(bold);
        kline.bolu = indicator.bolu = round2Dec(bolu);
        kline.rsi = indicator.rsi = rsi;
        kline.sma20 = indicator.sma20 = round2Dec(sma20);

        indicators.push(indicator);
      }
    }
    // console.log(JSON.stringify(klines));
    console.log(formatDateNumber(klines[0].openTime));
    setIndicator(indicator);

    const peaks: Kline[] = [];
    let overBuy: Kline | undefined = undefined;
    for (let i = 1; i < klines.length - 1; i++) {
      const kline = klines[i];
      const preKline = klines[i - 1];
      const nextKline = klines[i + 1];

      if (
        kline.rsi > 70 &&
        kline.high > kline.bolu &&
        kline.rsi > preKline.rsi &&
        kline.rsi > nextKline.rsi
      ) {
        overBuy = kline;
      }
      if (kline.rsi > preKline.rsi && kline.rsi > nextKline.rsi) {
        peaks.push(kline);
        if (overBuy && overBuy.rsi > kline.rsi && overBuy.high < kline.high) {
          console.log({
            longPeak: formatDateNumber(overBuy.openTime),
            peak: formatDateNumber(kline.openTime),
          });
        }
      }
    }
  };

  useEffect(() => {
    getAndCalculateKlines();
    const timer = setInterval(async () => {
      let newKlines = await bnbService.getKlines(symbol, interval, 1);
      const lstKline = newKlines[0];
      // if (klines[klines.length - 1].openTime === lstKline.openTime)
      //   klines[klines.length - 1] = lstKline;
      // else klines.push(lstKline);
      // calculateChart(klines, interval);
    }, HOUR * 4);

    return () => clearInterval(timer);
  }, [getAndCalculateKlines]);

  return (
    <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
      <TableCell component="th" scope="row">
        {interval}
      </TableCell>
      <TableCell align="right">{indicator.rsi}</TableCell>
      <TableCell align="right">{indicator.sma20}</TableCell>
      <TableCell align="right">{indicator.bolu}</TableCell>
      <TableCell align="right">{indicator.bold}</TableCell>
    </TableRow>
  );
};

export default IndicatorRow;
