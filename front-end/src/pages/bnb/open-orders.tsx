import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { round3Dec, formatDateNumber } from 'shared/utilities';
import { OpenOrder } from 'shared/bnb';
import { selectCancelling, selectOpenOrders, selectSymbol } from 'store/bnb-slice';
import { useSelector } from 'react-redux';
import {
  useCancelAllOrdersMutation,
  useCancelOrderMutation,
  useGetUsdtBalanceMutation,
} from 'store/bnb-api';

const OpenOrders = () => {
  const symbol = useSelector(selectSymbol);
  const openOrders = useSelector(selectOpenOrders);
  const { cancellingAll, cancellingOrderIds: cancelling } = useSelector(selectCancelling);

  const [cancelOrder] = useCancelOrderMutation();
  const [cancelAllOrders] = useCancelAllOrdersMutation();
  const [getUsdtBalance] = useGetUsdtBalanceMutation();

  const getPrice = (p: OpenOrder) => {
    let price = p.price;
    switch (p.type) {
      case 'TAKE_PROFIT_MARKET':
        price = p.stopPrice;
        break;
    }
    return round3Dec(price);
  };

  const handleCancelAll = async () => {
    await cancelAllOrders(symbol);
    await getUsdtBalance();
  };

  const handleCancel = async (orderId: number) => {
    await cancelOrder({ symbol, orderId });
    await getUsdtBalance();
  };

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
            {/* <TableCell align="right">Filled</TableCell> */}
            <TableCell align="right">
              <LoadingButton
                aria-label="delete"
                size="small"
                sx={{ textTransform: 'none' }}
                disabled={!openOrders.length}
                loading={cancellingAll}
                onClick={() => handleCancelAll()}
              >
                Cancel All
              </LoadingButton>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {openOrders
            .slice()
            .sort((a: OpenOrder, b: OpenOrder) => b.price - a.price)
            .map((p: OpenOrder) => {
              return (
                <TableRow
                  key={p.orderId}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell>{formatDateNumber(p.time)}</TableCell>
                  <TableCell>{p.symbol}</TableCell>
                  <TableCell align="right">{p.origType}</TableCell>
                  <TableCell
                    align="right"
                    sx={{ color: p.side === 'BUY' ? 'buy.main' : 'sell.main' }}
                  >
                    {p.side}
                  </TableCell>
                  <TableCell align="right">{getPrice(p)}</TableCell>
                  <TableCell align="right">{round3Dec(p.origQty * p.price)}</TableCell>
                  <TableCell align="right">{round3Dec(p.origQty)}</TableCell>
                  {/* <TableCell align="right">{round3Dec(p.executedQty)}</TableCell> */}
                  <TableCell align="right">
                    <LoadingButton
                      size="small"
                      loading={cancelling.includes(p.orderId) || cancellingAll}
                      sx={{ textTransform: 'none' }}
                      onClick={() => handleCancel(p.orderId)}
                    >
                      Cancel
                    </LoadingButton>
                  </TableCell>
                </TableRow>
              );
            })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default OpenOrders;
