import { useEffect, useCallback, useState } from 'react';
import useWebSocket from 'react-use-websocket';
import { useDispatch, useSelector } from 'react-redux';

import { Box, Tab } from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';

import { OpenOrder } from 'shared/bnb';
import Positions from './positions';
import OpenOrders from './open-orders';
import OrderForm from './order-form';
import Indicators from './indicators';

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
  const dispatch = useDispatch();

  const symbol = useSelector(selectSymbol);
  const side = useSelector(selectSide);
  const totalOpenOrders = useSelector(selectTotalOpenOrders);
  const totalPositions = useSelector(selectTotalPositions);
  const [value, setValue] = useState('1');
  const [createListenKey] = useCreateListenKeyMutation();
  useGetPositionsQuery({ symbol, side });
  useGetOpenOrdersQuery({ symbol, side });
  const [getUsdtBalance] = useGetUsdtBalanceMutation();

  useEffect(() => {
    getUsdtBalance();
  }, [getUsdtBalance]);

  const getListenKey = useCallback(async () => {
    const listenKey = await createListenKey().unwrap();
    return `wss://fstream.binance.com/ws/${listenKey}`;
  }, [createListenKey]);
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
        const orderId = parseFloat(od['i']);
        console.log(`${od['s']} ${od['x']} ${od['S']} ${od['p']} ${od['q']}`);
        switch (od['x']) {
          case 'NEW':
            const order = {
              time: od['T'],
              orderId,
              symbol: od['s'],
              origType: od['ot'],
              side: od['S'],
              executedQty: 0,
              origQty: parseFloat(od['q']),
              price: parseFloat(od['p']),
            } as OpenOrder;
            dispatch(addOpenOrder(order));
            break;
          case 'CANCELED':
          case 'TRADE':
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
  }, [lastMessage, dispatch]);

  const handleChange = (_: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <>
      <Indicators />
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
