import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import { round3Dec, formatDateNumber } from 'shared/utilities';
import { OpenOrdersProps, OpenOrder } from './types';

const OpenOrders = (props: OpenOrdersProps) => {
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
          {props.orders.map((p: OpenOrder) => (
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
