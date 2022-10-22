import { useEffect, useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import _ from 'lodash';
import { apiService } from 'store/services';
import { openHeader } from 'store/settings/actions';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Kline, Position, OpenOrder } from 'shared/bnb';
import bnbService from 'shared/bnb/service';
import { round2Dec, round3Dec } from 'shared/utilities';
import relativeStrengthIndex from './relative-strength-index';
import standardDeviation from './standard-deviation';
import Positions from './positions';
import OpenOrders from './open-orders';
import OrderForm from './order-form';
import Indicators from './indicators';

import { Indicator, mapStateToProps, mapDispatchToProps } from './types';

const Binance = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [m5State, setM5State] = useState(new Indicator('5m'));
  const [m15State, setM15State] = useState(new Indicator('15m'));
  const [m30State, setM30State] = useState(new Indicator('30m'));
  const [h1State, setH1State] = useState(new Indicator('1h'));
  const [h4State, setH4State] = useState(new Indicator('4h'));
  const [positions, setPositions] = useState<Position[]>([]);
  const [openOrders, setOpenOrders] = useState<OpenOrder[]>([]);
  const [userDataWS, setUserDataWS] = useState<WebSocket>();

  const [curPrice, setCurPrice] = useState(0);
  const [value, setValue] = useState('1');

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const startUserDataSocket = useCallback(async () => {
    if (!localStorage.listenKey) {
      const res = await apiService.post('bnb/listenKey');
      localStorage.listenKey = res.data.listenKey;
    }
    setUserDataWS(new WebSocket(`wss://fstream.binance.com/ws/${localStorage.listenKey}`));
  }, []);

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
  }, []);

  useEffect(() => {
    dispatch(openHeader());

    getAndCalculateKlines('NEARUSDT', '5m');
    getAndCalculateKlines('NEARUSDT', '15m');
    getAndCalculateKlines('NEARUSDT', '30m');
    getAndCalculateKlines('NEARUSDT', '1h');
    getAndCalculateKlines('NEARUSDT', '4h');
    getPositions();
    getOpenOrders();
    setInterval(() => {
      getPositions();
    }, 30 * 1000);
  }, [dispatch, navigate, getAndCalculateKlines]);

  useEffect(() => {
    console.log('User Data WS change');
    if (userDataWS != null) {
      userDataWS.onmessage = (event) => {
        const json = JSON.parse(event.data);
        console.log(json);
        switch (json['e']) {
          case 'listenKeyExpired':
            localStorage.removeItem('listenKey');
            startUserDataSocket();
            break;
          case 'ORDER_TRADE_UPDATE':
            switch (json['o']['x']) {
              case 'NEW':
                const order = new OpenOrder({
                  time: json['o']['T'],
                  orderId: json['o']['i'],
                  symbol: json['o']['s'],
                  origType: json['o']['ot'],
                  side: json['o']['S'],
                  executedQty: 0,
                  origQty: parseFloat(json['o']['q']),
                  price: parseFloat(json['o']['p']),
                });

                setOpenOrders([...openOrders, order]);
                break;
              case 'CANCELED':
                setOpenOrders(
                  openOrders.filter((x: OpenOrder) => x.orderId !== parseFloat(json['o']['i']))
                );
                break;
            }
            break;
        }
      };
    }
  }, [userDataWS, openOrders, startUserDataSocket]);

  useEffect(() => {
    startUserDataSocket();
  }, [startUserDataSocket]);

  useEffect(() => {
    const markPriceWS = new WebSocket('wss://fstream.binance.com/ws/nearusdt@markPrice');
    markPriceWS.onmessage = function (event) {
      try {
        const json = JSON.parse(event.data);
        if (json['p']) setCurPrice(round3Dec(parseFloat(json['p'])));
      } catch (err) {
        console.log(err);
      }
    };
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

  const getPositions = async () => {
    const res = await apiService.get(`bnb/positions/nearusdt`);
    setPositions(res.data);
  };

  const getOpenOrders = async () => {
    const res = await apiService.get(`bnb/openOrders/nearusdt`);
    setOpenOrders(res.data);
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
                  label={`Positions${positions.length > 0 ? ` (${positions.length})` : ''}`}
                  value="1"
                />
                <Tab
                  label={`Open orders${openOrders.length > 0 ? ` (${openOrders.length})` : ''}`}
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
      <Box sx={{ display: 'flex', flexGrow: 1, paddingTop: 2 }}>
        {(() => {
          let totalQuantity = 0;
          let totalSize = 0;
          for (const p of positions) {
            totalQuantity += p.positionAmt;
            totalSize += p.positionAmt * p.entryPrice;
          }

          for (const o of openOrders) {
            totalQuantity += o.origQty;
            totalSize += o.origQty * o.price;
          }
          if (positions.length || openOrders.length) {
            const entry = round3Dec(totalSize / totalQuantity);
            const liq = round3Dec(entry - ((80 / 20) * entry) / 100);
            return (
              <div>
                Entry Price: {entry} <br />
                Liq.Price: {liq}
              </div>
            );
          }
        })()}
      </Box>
    </>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Binance);
