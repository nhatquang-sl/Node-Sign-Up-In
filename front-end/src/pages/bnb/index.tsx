import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { API_ENDPOINT } from 'store/constants';
import Box from '@mui/material/Box';
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
import Indicators from './indicators';

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

    let handledMinute = new Date().getMinutes();
    const ws = new WebSocket(`wss://fstream.binance.com/ws/nearusdt@kline_${interval}`);
    ws.onmessage = function (event) {
      const json = JSON.parse(event.data);
      const eventMinute = new Date(json['E']).getMinutes();

      if (eventMinute > handledMinute) {
        handledMinute = eventMinute;
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
      <Indicators
        indicators={[m5State, m15State, m30State, h1State, h4State]}
        currentPrice={curPrice}
      />
      <Box sx={{ display: 'flex', flexGrow: 1, paddingTop: 2 }}>
        <OrderForm />
        <Box sx={{ flexGrow: 1 }}>
          <TabContext value={value}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <TabList onChange={handleChange} aria-label="lab API tabs example">
                <Tab
                  label={`Positions${positions.length > 0 && ` (${positions.length})`}`}
                  value="1"
                />
                <Tab
                  label={`Open orders${openOrders.length > 0 && ` (${openOrders.length})`}`}
                  value="2"
                />
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
