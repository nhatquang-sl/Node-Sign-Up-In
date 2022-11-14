import { useEffect, useCallback, useState } from 'react';
import useWebSocket from 'react-use-websocket';
import _ from 'lodash';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { Box, Tab } from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';

import { TIMESTAMP } from 'shared/constant';
import { bnbService, Kline, Position, OpenOrder, Balance } from 'shared/bnb';
import { round2Dec, round3Dec } from 'shared/utilities';
import { useApiService } from 'hooks';
import relativeStrengthIndex from './relative-strength-index';
import standardDeviation from './standard-deviation';
import Positions from './positions';
import OpenOrders from './open-orders';
import OrderForm from './order-form';
import Indicators from './indicators';

import { Indicator, mapStateToProps, mapDispatchToProps } from './types';

const Binance = () => {
  const navigate = useNavigate();
  const apiService = useApiService();

  const [m5State, setM5State] = useState(new Indicator('5m'));
  const [m15State, setM15State] = useState(new Indicator('15m'));
  const [m30State, setM30State] = useState(new Indicator('30m'));
  const [h1State, setH1State] = useState(new Indicator('1h'));
  const [h4State, setH4State] = useState(new Indicator('4h'));
  const [positions, setPositions] = useState<Position[]>([]);
  const [openOrders, setOpenOrders] = useState<OpenOrder[]>([]);
  const [klineWSes, setKlineWSes] = useState<WebSocket[]>([]);

  const [side, setSide] = useState(localStorage.orderSide ?? 'buy');
  const [curPrice, setCurPrice] = useState(0);
  const [entryEstimate, setEntryEstimate] = useState(0);
  const [liqEstimate, setLiqEstimate] = useState(0);
  const [value, setValue] = useState('1');
  const [usdtAvailable, setUsdtAvailable] = useState(0);
  const getListenKey = useCallback(async () => {
    const res = await apiService.post('bnb/listenKey');
    setInterval(() => {
      try {
        apiService.put(`bnb/listenKey/${res.data.listenKey}`);
      } catch (err) {}
    }, TIMESTAMP.HOUR);
    return `wss://fstream.binance.com/ws/${res.data.listenKey}`;
  }, []);
  const { lastMessage } = useWebSocket(getListenKey);

  const estimateLiqAndEntry = useCallback(
    (side: string, positions: Position[], orders: OpenOrder[]) => {
      let quantityTotal = 0;
      let sizeTotal = 0;
      console.log('estimateLiqAndEntry', positions.length, orders.length);
      for (const p of positions) {
        quantityTotal += Math.abs(p.positionAmt);
        sizeTotal += Math.abs(p.positionAmt * p.entryPrice);
      }

      for (const o of orders) {
        quantityTotal += o.origQty;
        sizeTotal += o.origQty * o.price;
      }

      if (positions.length || orders.length) {
        const entry = round3Dec(sizeTotal / quantityTotal);
        let liq = round3Dec(entry - ((79 / 20) * entry) / 100);
        if (side === 'sell') {
          liq = round3Dec(entry + ((76 / 20) * entry) / 100);
        }
        console.log({ entry, liq });
        setEntryEstimate(entry);
        setLiqEstimate(liq);
      }
    },
    []
  );

  useEffect(() => {
    if (!lastMessage) return;
    const json = JSON.parse(lastMessage?.data);
    switch (json['e']) {
      case 'listenKeyExpired':
        window.location.reload();
        break;
      case 'ORDER_TRADE_UPDATE':
        const od = json['o'];
        console.log(`${od['s']} ${od['x']} ${od['S']} ${od['p']} ${od['q']}`);
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

            setOpenOrders((orders) => orders.concat(order));
            break;
          case 'CANCELED':
          case 'TRADE':
            const orderId = parseFloat(json['o']['i']);
            setOpenOrders((orders) => orders.filter((o) => o.orderId !== orderId));
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

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
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

  const getPositions = useCallback(async (side: string) => {
    const res = await apiService.get<Position[]>(`bnb/positions/NEARUSDT`);
    const data = res.data.filter((d) => (side === 'buy' ? d.positionAmt > 0 : d.positionAmt < 0));
    setPositions((positions) => {
      if (positions.length === 0 && data.length !== 0) return data;
      positions.splice(0);
      for (const d of data) positions.push(d);
      return positions;
    });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      getPositions(side);
    }, 3 * TIMESTAMP.SECOND);
    return () => clearInterval(interval);
  }, [side, getPositions]);

  const getOpenOrders = useCallback(async (side: string) => {
    const res = await apiService.get<OpenOrder[]>(`bnb/openOrders/nearusdt`);
    setOpenOrders(
      res.data.filter(
        (d) =>
          (d.side.toLocaleLowerCase() === side && d.type !== 'TAKE_PROFIT_MARKET') ||
          (d.side.toLocaleLowerCase() !== side && d.type === 'TAKE_PROFIT_MARKET')
      )
    );
  }, []);

  const getBalance = async () => {
    const res = await apiService.get('bnb/balance');
    // console.log(res.data.filter((x: Balance) => x.asset === 'USDT'));
    setUsdtAvailable(res.data.filter((x: Balance) => x.asset === 'USDT')[0].availableBalance);
  };

  useEffect(() => {
    getAndCalculateKlines('NEARUSDT', '5m');
    getAndCalculateKlines('NEARUSDT', '15m');
    getAndCalculateKlines('NEARUSDT', '30m');
    getAndCalculateKlines('NEARUSDT', '1h');
    getAndCalculateKlines('NEARUSDT', '4h');
    getPositions(side);
    getOpenOrders(side);
    getBalance();

    return () => {
      klineWSes.forEach((x) => x.close());
    };
  }, [navigate, getAndCalculateKlines]);

  // WS: get market price
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

    return () => markPriceWS.close();
  }, []);

  useEffect(() => {
    estimateLiqAndEntry(side, positions, openOrders);
  }, [side, positions, openOrders, estimateLiqAndEntry]);

  const handleCreateOrderSuccess = (order: OpenOrder) => {
    getBalance();
  };

  const handleCancelOrder = async (symbol: string, orderId: number): Promise<number> => {
    await apiService.delete(`bnb/order/${symbol}/${orderId}`);
    setOpenOrders(openOrders.filter((x) => x.orderId !== orderId));
    getBalance();
    return orderId;
  };

  const handleCancelAllOrders = async (symbol: string): Promise<void> => {
    await apiService.delete(`bnb/all-orders/${symbol}`);
    getBalance();
  };

  const handleChangeSide = (side: string) => {
    console.log({ side });
    localStorage.orderSide = side;
    getPositions(side);
    getOpenOrders(side);
    setSide(side);
  };

  return (
    <>
      <Indicators
        indicators={[m5State, m15State, m30State, h1State, h4State]}
        currentPrice={curPrice}
      />
      <Box sx={{ display: 'flex', flexGrow: 1, paddingTop: 2 }}>
        <OrderForm
          usdtAvailable={usdtAvailable}
          entryEstimate={entryEstimate}
          liqEstimate={liqEstimate}
          side={side}
          onChangeSide={handleChangeSide}
          onSuccess={handleCreateOrderSuccess}
        />
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
              <OpenOrders
                orders={openOrders}
                cancel={handleCancelOrder}
                cancelAll={handleCancelAllOrders}
              />
            </TabPanel>
          </TabContext>
        </Box>
      </Box>
      <Box sx={{ display: 'flex', flexGrow: 1, paddingTop: 2 }}>
        <div>
          Entry Price: {entryEstimate} <br />
          Liq.Price: {liqEstimate}
        </div>
      </Box>
    </>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Binance);
