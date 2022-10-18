import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { API_ENDPOINT } from 'store/constants';
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
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import _ from 'lodash';
import { openHeader } from 'store/settings/actions';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Kline } from 'shared/bnb';
import bnbService from 'shared/bnb/service';
import { round2Dec, round3Dec } from 'shared/utilities';
import relativeStrengthIndex from './relative-strength-index';
import standardDeviation from './standard-deviation';
import Positions from './positions';
import OpenOrders from './open-orders';
import OrderForm from './order-form';

import { Props, Indicator, mapStateToProps, mapDispatchToProps } from './types';

const Binance = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [m5State, setM5State] = useState(new Indicator('5m'));
  const [m15State, setM15State] = useState(new Indicator('15m'));
  const [m30State, setM30State] = useState(new Indicator('30m'));
  const [h1State, setH1State] = useState(new Indicator('1h'));
  const [h4State, setH4State] = useState(new Indicator('4h'));
  const [positions, setPositions] = useState([]);
  const [openOrders, setOpenOrders] = useState([]);
  const [curPrice, setCurPrice] = useState(0);
  const [value, setValue] = useState('1');

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  useEffect(() => {
    dispatch(openHeader());

    getAndCalculateKlines('NEARUSDT', '5m');
    getAndCalculateKlines('NEARUSDT', '15m');
    getAndCalculateKlines('NEARUSDT', '30m');
    getAndCalculateKlines('NEARUSDT', '1h');
    getAndCalculateKlines('NEARUSDT', '4h');
    startSocket();
    getPositions();
    getOpenOrders();
    setInterval(() => {
      getPositions();
      getOpenOrders();
    }, 30 * 1000);
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

  const getPositions = async () => {
    const res = await axios.get(`${API_ENDPOINT}/bnb/positions/nearusdt`);
    setPositions(res.data);
  };

  const getOpenOrders = async () => {
    const res = await axios.get(`${API_ENDPOINT}/bnb/openOrders/nearusdt`);
    setOpenOrders(res.data);
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
        <OrderForm />
        <Box sx={{ flexGrow: 1 }}>
          <TabContext value={value}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <TabList onChange={handleChange} aria-label="lab API tabs example">
                <Tab label="Positions" value="1" />
                <Tab label="Open orders" value="2" />
              </TabList>
            </Box>
            <TabPanel value="1" sx={{ padding: 0 }}>
              <Positions positions={positions} />
            </TabPanel>
            <TabPanel value="2" sx={{ padding: 0 }}>
              <OpenOrders orders={openOrders} />
            </TabPanel>
          </TabContext>
        </Box>
      </Box>
    </>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Binance);
