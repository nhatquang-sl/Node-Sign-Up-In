import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import _ from 'lodash';
import { openHeader } from 'store/settings/actions';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Kline } from 'shared/bnb';
import bnbService from 'shared/bnb/service';
import { round2Dec, round3Dec } from 'shared/utilities';
import relativeStrengthIndex from './relative-strength-index';
import standardDeviation from './standard-deviation';
import axios from 'axios';
import { API_ENDPOINT } from 'store/constants';

import { Props, Indicator, mapStateToProps, mapDispatchToProps } from './types';

const Binance = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [m5State, setM5State] = useState(new Indicator('5m'));
  const [m15State, setM15State] = useState(new Indicator('15m'));
  const [m30State, setM30State] = useState(new Indicator('30m'));
  const [h1State, setH1State] = useState(new Indicator('1h'));
  const [h4State, setH4State] = useState(new Indicator('4h'));
  const [curPrice, setCurPrice] = useState(0);
  const [positions, setPositions] = useState([]);

  useEffect(() => {
    dispatch(openHeader());

    getAndCalculateKlines('NEARUSDT', '5m');
    getAndCalculateKlines('NEARUSDT', '15m');
    getAndCalculateKlines('NEARUSDT', '30m');
    getAndCalculateKlines('NEARUSDT', '1h');
    getAndCalculateKlines('NEARUSDT', '4h');
    startSocket();
  }, [dispatch, navigate]);

  const startSocket = async () => {
    const ws = new WebSocket('wss://fstream.binance.com/ws/nearusdt@markPrice');

    ws.onmessage = function (event) {
      try {
        const json = JSON.parse(event.data);
        if (json['p']) setCurPrice(round3Dec(parseFloat(json['p'])));
      } catch (err) {
        console.log(err);
      }
    };

    await getAllOrders();
  };

  const getAllOrders = async () => {
    const orders = await axios.get(`${API_ENDPOINT}/bnb/orders/nearusdt`);
    setPositions(orders.data);
    console.log(orders.data);
  };

  const getAndCalculateKlines = async (symbol: string, interval: string) => {
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
    <>
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
              <TableRow
                key={row.interval}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
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
      <Box sx={{ display: 'flex', flexGrow: 1, paddingTop: 2 }}>
        <Box component="form" sx={{ width: 200 }} noValidate autoComplete="off">
          <FormControl variant="outlined" fullWidth size="small">
            <InputLabel>Price</InputLabel>
            <OutlinedInput
              label="Price"
              endAdornment={<InputAdornment position="end">USDT</InputAdornment>}
            />
          </FormControl>
          <FormControl variant="outlined" fullWidth size="small" margin="dense">
            <InputLabel>Size</InputLabel>
            <OutlinedInput
              label="Size"
              endAdornment={<InputAdornment position="end">USDT</InputAdornment>}
            />
          </FormControl>
          <Stack direction="row" justifyContent="space-between" sx={{ paddingTop: 1 }}>
            <Button variant="contained" color="buy" sx={{ textTransform: 'none' }}>
              Buy/Long
            </Button>
            <Button variant="contained" color="sell" sx={{ textTransform: 'none' }}>
              Sell/Short
            </Button>
          </Stack>
        </Box>
        <Box sx={{ flexGrow: 1 }}>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Symbol</TableCell>
                  <TableCell align="right">Size</TableCell>
                  <TableCell align="right">Entry Price</TableCell>
                  <TableCell align="right">Mark Price</TableCell>
                  <TableCell align="right">Liq.Price</TableCell>
                  <TableCell align="right">PNL(ROE %)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {positions.map((p: any) => (
                  <TableRow
                    key={p.symbol}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {p.symbol} {p.marginType}({p.leverage}x)
                    </TableCell>
                    <TableCell align="right">{round3Dec(p.notional)}</TableCell>
                    <TableCell align="right">{p.entryPrice}</TableCell>
                    <TableCell align="right">{round3Dec(p.markPrice)}</TableCell>
                    <TableCell align="right">{round3Dec(p.liquidationPrice)}</TableCell>
                    <TableCell align="right">{round3Dec(p.unRealizedProfit)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Binance);
