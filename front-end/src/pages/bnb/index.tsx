import { useEffect, useCallback, useState } from 'react';
import useWebSocket from 'react-use-websocket';
import _ from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { Box, Tab } from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';

import { TIMESTAMP } from 'shared/constant';
import { bnbService, Kline, Position, OpenOrder, Balance } from 'shared/bnb';
import { round2Dec, round3Dec } from 'shared/utilities';
import relativeStrengthIndex from './relative-strength-index';
import standardDeviation from './standard-deviation';
import Positions from './positions';
import OpenOrders from './open-orders';
import OrderForm from './order-form';
import Indicators from './indicators';

import { Indicator } from './types';
import {
  useCreateListenKeyMutation,
  useGetUsdtBalanceMutation,
  useGetOpenOrdersQuery,
  useGetPositionsQuery,
} from 'store/bnb-api';
import {
  addOpenOrder,
  removeOpenOrder,
  selectSide,
  selectSymbol,
  selectTotalOpenOrders,
  selectTotalPositions,
} from 'store/bnb-slice';

const Binance = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [m5State, setM5State] = useState(new Indicator('5m'));
  const [m15State, setM15State] = useState(new Indicator('15m'));
  const [m30State, setM30State] = useState(new Indicator('30m'));
  const [h1State, setH1State] = useState(new Indicator('1h'));
  const [h4State, setH4State] = useState(new Indicator('4h'));
  const [klineWSes, setKlineWSes] = useState<WebSocket[]>([]);

  const symbol = useSelector(selectSymbol);
  const side = useSelector(selectSide);
  const totalOpenOrders = useSelector(selectTotalOpenOrders);
  const totalPositions = useSelector(selectTotalPositions);
  const [value, setValue] = useState('1');
  const [createListenKey] = useCreateListenKeyMutation();
  useGetPositionsQuery({ symbol, side });
  useGetOpenOrdersQuery({ symbol, side });
  const [getUsdtBalance] = useGetUsdtBalanceMutation();

  const getListenKey = useCallback(async () => {
    const listenKey = await createListenKey().unwrap();
    console.log(`wss://fstream.binance.com/ws/${listenKey}`);
    return `wss://fstream.binance.com/ws/${listenKey}`;
  }, []);
  const { lastMessage } = useWebSocket(getListenKey);

  useEffect(() => {
    if (!lastMessage) return;
    const json = JSON.parse(lastMessage?.data);
    // console.log(json);
    switch (json['e']) {
      case 'listenKeyExpired':
        window.location.reload();
        break;
      case 'ORDER_TRADE_UPDATE':
        const od = json['o'];
        console.log(`${od['s']} ${od['x']} ${od['S']} ${od['p']} ${od['q']}`);
        switch (json['o']['x']) {
          case 'NEW':
            const order = {
              time: json['o']['T'],
              orderId: json['o']['i'],
              symbol: json['o']['s'],
              origType: json['o']['ot'],
              side: json['o']['S'],
              executedQty: 0,
              origQty: parseFloat(json['o']['q']),
              price: parseFloat(json['o']['p']),
            } as OpenOrder;
            dispatch(addOpenOrder(order));
            break;
          case 'CANCELED':
          case 'TRADE':
            const orderId = parseFloat(json['o']['i']);
            dispatch(removeOpenOrder(orderId));
            break;
          default:
            console.log(lastMessage?.data);
            break;
        }
        break;
      default:
        console.log(lastMessage?.data);
        break;
    }
  }, [lastMessage]);

  const handleChange = (_: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const getAndCalculateKlines = useCallback(async (symbol: string, interval: string) => {
    const klines = await bnbService.getKlines(symbol, interval);
    calculateChart(klines, interval);

    let handledTime = (new Date().getSeconds() / 30) >> 0;
    const ws = new WebSocket(`wss://fstream.binance.com/ws/nearusdt@kline_${interval}`);
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

    setKlineWSes((prevVal) => {
      prevVal.push(ws);
      return prevVal;
    });
  }, []);

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

  useEffect(() => {
    getAndCalculateKlines('NEARUSDT', '5m');
    getAndCalculateKlines('NEARUSDT', '15m');
    getAndCalculateKlines('NEARUSDT', '30m');
    getAndCalculateKlines('NEARUSDT', '1h');
    getAndCalculateKlines('NEARUSDT', '4h');
    // getPositions(symbol, side);
    // getOpenOrders(symbol, side);
    getUsdtBalance();

    return () => {
      klineWSes.forEach((x) => x.close());
    };
  }, [navigate, getAndCalculateKlines]);

  return (
    <>
      <Indicators indicators={[m5State, m15State, m30State, h1State, h4State]} />
      <Box sx={{ display: 'flex', flexGrow: 1, paddingTop: 2 }}>
        <OrderForm />
        <Box sx={{ flexGrow: 1 }}>
          <TabContext value={value}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <TabList onChange={handleChange} aria-label="lab API tabs example">
                <Tab label={`Positions (${totalPositions})`} value="1" />
                <Tab label={`Open orders (${totalOpenOrders})`} value="2" />
              </TabList>
            </Box>
            <TabPanel value="1" sx={{ padding: 0 }}>
              <Positions />
            </TabPanel>
            <TabPanel value="2" sx={{ padding: 0 }}>
              <OpenOrders />
            </TabPanel>
          </TabContext>
        </Box>
      </Box>
    </>
  );
};

export default Binance;
