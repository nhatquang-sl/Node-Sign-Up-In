import axios from 'axios';
import { useEffect, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import _ from 'lodash';

import { round3Dec, formatDateNumber } from 'shared/utilities';
import { API_ENDPOINT } from 'store/constants';
import { OpenOrdersProps } from './types';

const OpenOrders = (props: OpenOrdersProps) => {
  // const [positions, setPositions] = useState([]);

  // useEffect(() => {
  //   getOpenOrders();
  //   // startWebSocket();
  // }, []);

  // const getOpenOrders = async () => {
  //   console.log(`${API_ENDPOINT}/bnb/openOrders/${props.symbol}`);
  //   const res = await axios.get(`${API_ENDPOINT}/bnb/openOrders/${props.symbol}`);
  //   console.log(res.data);
  //   setPositions(res.data);
  // };

  // const startWebSocket = async () => {
  //   const listenKeyRes = await axios.post(`${API_ENDPOINT}/bnb/listenKey`);
  //   console.log(listenKeyRes.data['listenKey']);
  //   const ws = new WebSocket(`wss://fstream.binance.com/ws/${listenKeyRes.data['listenKey']}`);

  //   ws.onopen = function (event) {
  //     console.log(event);
  //   };

  //   ws.onmessage = function (event) {
  //     try {
  //       const json = JSON.parse(event.data);
  //       console.log(event.data);
  //       console.log(json);
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   };
  //   setInterval(() => {
  //     axios.put(`${API_ENDPOINT}/bnb/listenKey`);
  //   }, 20 * 60 * 1000);
  // };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Time</TableCell>
            <TableCell>Symbol</TableCell>
            <TableCell align="right">Type</TableCell>
            <TableCell align="right">Side</TableCell>
            <TableCell align="right">Price</TableCell>
            <TableCell align="right">Amount</TableCell>
            <TableCell align="right">Quantity</TableCell>
            <TableCell align="right">Filled</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.orders.map((p: any) => (
            <TableRow key={p.orderId} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableCell>{formatDateNumber(p.time)}</TableCell>
              <TableCell>{p.symbol}</TableCell>
              <TableCell align="right">{p.origType}</TableCell>
              <TableCell align="right">{p.side}</TableCell>
              <TableCell align="right">{round3Dec(p.price)}</TableCell>
              <TableCell align="right">{round3Dec(p.origQty * p.price)}</TableCell>
              <TableCell align="right">{round3Dec(p.origQty)}</TableCell>
              <TableCell align="right">{round3Dec(p.executedQty)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default OpenOrders;
