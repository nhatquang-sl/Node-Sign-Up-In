import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import { IndicatorsProps } from './types';
import { useEffect, useState } from 'react';
import { round3Dec } from 'shared/utilities';
import { useSelector } from 'react-redux';
import { selectSymbol } from 'store/bnb-slice';

const Indicators = (props: IndicatorsProps) => {
  const symbol = useSelector(selectSymbol);

  const [curPrice, setCurPrice] = useState(0);

  // WS: get market price
  useEffect(() => {
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
          {props.indicators.map((row) => (
            <TableRow key={row.interval} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableCell component="th" scope="row">
                {row.interval}
              </TableCell>
              <TableCell align="right">{row.rsi}</TableCell>
              <TableCell align="right">{row.sma20}</TableCell>
              <TableCell align="right">{row.bolu}</TableCell>
              <TableCell align="right">{row.bold}</TableCell>
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

export default Indicators;
