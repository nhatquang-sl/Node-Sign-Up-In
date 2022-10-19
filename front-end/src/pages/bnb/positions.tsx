import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { round3Dec } from 'shared/utilities';
import { PositionProps } from './types';

const Positions = (props: PositionProps) => {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Symbol</TableCell>
            <TableCell align="right">Size</TableCell>
            <TableCell align="right">Entry Price</TableCell>
            <TableCell align="right">Mark Price</TableCell>
            <TableCell align="right">Liq.Price</TableCell>
            <TableCell align="right">Quantity</TableCell>
            <TableCell align="right">PNL(ROE %)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.positions.map((p: any) => (
            <TableRow key={p.symbol} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableCell component="th" scope="row">
                {p.symbol} {p.marginType}({p.leverage}x)
              </TableCell>
              <TableCell align="right">{round3Dec(p.notional)}</TableCell>
              <TableCell align="right">{round3Dec(p.entryPrice)}</TableCell>
              <TableCell align="right">{round3Dec(p.markPrice)}</TableCell>
              <TableCell align="right">{round3Dec(p.liquidationPrice)}</TableCell>
              <TableCell align="right">{round3Dec(p.positionAmt)}</TableCell>
              <TableCell align="right">{round3Dec(p.unRealizedProfit)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default Positions;
