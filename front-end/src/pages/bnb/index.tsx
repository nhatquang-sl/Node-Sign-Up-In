import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import _ from 'lodash';
import { openHeader } from 'store/settings/actions';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Kline } from 'shared/bnb';
import bnbService from 'shared/bnb/service';
import { round2Dec } from 'shared/utilities';
import relativeStrengthIndex from './relative-strength-index';
import standardDeviation from './standard-deviation';

import { Props, Indicator, mapStateToProps, mapDispatchToProps } from './types';

const Binance = (props: Props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [m5State, setM5State] = useState(new Indicator('5m'));
  const [m15State, setM15State] = useState(new Indicator('15m'));
  const [m30State, setM30State] = useState(new Indicator('30m'));
  const [h1State, setH1State] = useState(new Indicator('1h'));
  const [h4State, setH4State] = useState(new Indicator('4h'));
  const [curPrice, setCurPrice] = useState(0);

  useEffect(() => {
    dispatch(openHeader());

    getM5Klines('NEARUSDT', '5m');
    getM5Klines('NEARUSDT', '15m');
    getM5Klines('NEARUSDT', '30m');
    getM5Klines('NEARUSDT', '1h');
    getM5Klines('NEARUSDT', '4h');
  }, [dispatch, navigate]);

  const getM5Klines = async (symbol: string, interval: string) => {
    const klines = await bnbService.getKlines(symbol, interval);
    calculateChart(klines, interval);

    setInterval(async () => {
      const lstKline = (await bnbService.getKlines(symbol, interval, 1))[0];
      if (klines[klines.length - 1].openTime === lstKline.openTime)
        klines[klines.length - 1] = lstKline;
      else klines.push(lstKline);
      calculateChart(klines, interval);
    }, 30 * 1000);
  };

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

    switch (interval) {
      case '5m':
        setCurPrice(klines[klines.length - 1].close);
        setM5State(indicator);
        break;
      case '15m':
        setM15State(indicator);
        break;
      case '30m':
        setM30State(indicator);
        break;
      case '1h':
        setH1State(indicator);
        break;
      case '4h':
        setH4State(indicator);
        break;
    }

    return indicator;
  };

  function createData(name: string, calories: number, fat: number, carbs: number, protein: number) {
    return { name, calories, fat, carbs, protein };
  }

  const rows = [
    createData('5m', 159, 6.0, 24, 4.0),
    createData('15m', 237, 9.0, 37, 4.3),
    createData('30m', 262, 16.0, 24, 6.0),
    createData('1h', 305, 3.7, 67, 4.3),
    createData('4h', 356, 16.0, 49, 3.9),
  ];

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Interval</TableCell>
            <TableCell align="right">RSI</TableCell>
            <TableCell align="right">SMA20</TableCell>
            <TableCell align="right">Bol Up</TableCell>
            <TableCell align="right">Bol Down</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {[m5State, m15State, m30State, h1State, h4State].map((row) => (
            <TableRow key={row.interval} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableCell component="th" scope="row">
                {row.interval}
              </TableCell>
              <TableCell align="right">{row.rsi}</TableCell>
              <TableCell align="right">{row.sma20}</TableCell>
              <TableCell align="right">{row.bolu}</TableCell>
              <TableCell align="right">{row.bold}</TableCell>
              {/* <TableCell align="right">{row.fat}</TableCell>
              <TableCell align="right">{row.carbs}</TableCell>
              <TableCell align="right">{row.protein}</TableCell> */}
            </TableRow>
          ))}
          <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
            <TableCell colSpan={2}>Current Price: {curPrice}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Binance);
