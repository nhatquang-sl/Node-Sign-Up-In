import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import _ from 'lodash';
import { TableCell, TableRow } from '@mui/material';

import { selectSymbol } from 'store/bnb-slice';
import { round2Dec } from 'shared/utilities';
import { bnbService, Kline } from 'shared/bnb';

import standardDeviation from './standard-deviation';
import relativeStrengthIndex from './relative-strength-index';
import { Indicator } from './types';

const IndicatorRow = ({ interval }: { interval: string }) => {
  const symbol = useSelector(selectSymbol);
  const ws: WebSocket = useMemo(
    () => new WebSocket(`wss://fstream.binance.com/ws/${symbol}@kline_${interval}`),
    [symbol, interval]
  );
  const [indicator, setIndicator] = useState(new Indicator(interval));

  const getAndCalculateKlines = useCallback(async () => {
    const klines = await bnbService.getKlines(symbol, interval);
    calculateChart(klines, interval);

    let handledTime = (new Date().getSeconds() / 30) >> 0;
    ws.onmessage = function (event) {
      const json = JSON.parse(event.data);
      const eventTime = (new Date(json['E']).getSeconds() / 30) >> 0;
      // console.log({ eventTime, handledTime, currTime: formatDate(new Date(), 'MM:ss') });
      if (eventTime !== handledTime) {
        handledTime = eventTime;
        const lstKline = new Kline();
        lstKline.openTime = parseFloat(json['k']['t']);
        lstKline.closeTime = parseFloat(json['k']['T']);
        lstKline.open = parseFloat(json['k']['o']);
        lstKline.close = parseFloat(json['k']['c']);
        lstKline.high = parseFloat(json['k']['h']);
        lstKline.low = parseFloat(json['k']['l']);
        lstKline.volume = parseFloat(json['k']['v']);
        lstKline.quoteAssetVolume = parseFloat(json['k']['q']);
        lstKline.numberOfTrades = parseFloat(json['k']['n']);
        lstKline.takerBuyBaseAssetVolume = parseFloat(json['k']['V']);
        lstKline.takerBuyQuoteAssetVolume = parseFloat(json['k']['Q']);

        if (klines[klines.length - 1].openTime === lstKline.openTime)
          klines[klines.length - 1] = lstKline;
        else klines.push(lstKline);
        calculateChart(klines, interval);
      }
    };
    return ws;
  }, [symbol, interval, ws]);

  const calculateChart = (klines: Kline[], interval: string): Indicator => {
    let avgGain = -1,
      avgLoss = -1;
    const indicator = new Indicator(interval);
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

        indicator.bold = round2Dec(bold);
        indicator.bolu = round2Dec(bolu);
        indicator.rsi = rsi;
        indicator.sma20 = round2Dec(sma20);
      }
    }
    setIndicator(indicator);
    return indicator;
  };

  useEffect(() => {
    getAndCalculateKlines();
    return () => {
      if (ws) ws.close();
    };
  }, [getAndCalculateKlines, ws]);
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
