import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  Paper,
} from '@mui/material';

import { selectSymbol } from 'store/bnb-slice';
import { round3Dec } from 'shared/utilities';
import IndicatorRow from './indicator-row';

const Indicators = () => {
  const symbol = useSelector(selectSymbol);

  const [curPrice, setCurPrice] = useState(0);

  useEffect(() => {
    // WS: get market price
    const markPriceWS = new WebSocket(`wss://fstream.binance.com/ws/${symbol}@markPrice`);
    markPriceWS.onmessage = function (event) {
      try {
        const json = JSON.parse(event.data);
        if (json['p']) setCurPrice(round3Dec(parseFloat(json['p'])));
      } catch (err) {
        console.log(err);
      }
    };

    return () => markPriceWS.close();
  }, [symbol]);

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
          {['5m', '15m', '30m', '1h', '4h'].map((interval) => (
            <IndicatorRow key={interval} interval={interval} />
          ))}
          <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
            <TableCell colSpan={2}>Current Price: {curPrice}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default Indicators;
