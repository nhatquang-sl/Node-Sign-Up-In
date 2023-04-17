import { useEffect, useState } from 'react';
import {
  Box,
  OutlinedInput,
  InputAdornment,
  InputLabel,
  FormControl,
  Stack,
  Typography,
  Select,
  SelectChangeEvent,
  MenuItem,
} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { round2Dec } from 'shared/utilities';
import {
  selectEstLiqAndEntry,
  selectSide,
  selectSymbol,
  selectUsdtBalance,
  setSide,
  setSymbol,
} from 'store/bnb-slice';
import { useDispatch, useSelector } from 'react-redux';
import { useCreateOrderMutation, useGetUsdtBalanceMutation } from 'store/bnb-api';
import { Order, OrderSide } from 'shared/bnb';

const SYMBOLS = [
  {
    value: 'maskusdt',
    text: 'MASKUSDT',
  },
  {
    value: 'aptusdt',
    text: 'APTUSDT',
  },
  {
    value: 'galausdt',
    text: 'GALAUSDT',
  },
  {
    value: 'nearusdt',
    text: 'NEARUSDT',
  },
  {
    value: 'c98usdt',
    text: 'C98USDT',
  },
];

const OrderForm = () => {
  const dispatch = useDispatch();
  const symbol = useSelector(selectSymbol);
  const side = useSelector(selectSide);
  const usdtBalance = useSelector(selectUsdtBalance);
  const est = useSelector(selectEstLiqAndEntry);
  console.log({ est });
  const [price, setPrice] = useState('');
  const [size, setSize] = useState(localStorage.orderSize ?? '');

  const [getUsdtBalance] = useGetUsdtBalanceMutation();
  const [createOrder, { isLoading }] = useCreateOrderMutation();

  useEffect(() => {
    setPrice(est.liq.toString());
  }, [est.liq]);

  const handleSelectChange = (event: SelectChangeEvent) => {
    let value = event.target.value;
    switch (event.target.name) {
      case 'side':
        dispatch(setSide(value as OrderSide));
        break;
      case 'symbol':
        dispatch(setSymbol(value));
        break;
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let value = parseFloat(event.target.value);
    console.log(value, event.target.name);
    switch (event.target.name) {
      case 'price':
        setPrice(value.toString());
        break;
      case 'size':
        localStorage.orderSize = value;
        setSize(value);
        break;
    }
  };

  const handleSubmit = async () => {
    try {
      await createOrder({
        symbol: symbol.toUpperCase(),
        price: parseFloat(price),
        quantity: parseFloat(size),
        side: side.toUpperCase(),
      } as Order);
      getUsdtBalance();
    } catch (err) {}
  };

  const enableSubmit = () => {
    try {
      return parseFloat(price) > 0 && parseFloat(size) > 0;
    } catch (err) {
      return false;
    }
  };

  return (
    <Box component="form" sx={{ width: 200 }} noValidate autoComplete="off">
      <Typography variant="subtitle2" gutterBottom>
        Avbl: {round2Dec(usdtBalance)} USDT
      </Typography>
      <FormControl variant="outlined" fullWidth size="small">
        <InputLabel>Symbol</InputLabel>
        <Select label="Symbol" name="symbol" value={symbol} onChange={handleSelectChange}>
          {SYMBOLS.map((s) => (
            <MenuItem key={s.value} value={s.value}>
              {s.text}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl variant="outlined" fullWidth size="small" margin="dense">
        <InputLabel>Side</InputLabel>
        <Select label="Side" name="side" value={side} onChange={handleSelectChange}>
          <MenuItem value={OrderSide.BUY}>Long</MenuItem>
          <MenuItem value={OrderSide.SELL}>Short</MenuItem>
        </Select>
      </FormControl>
      <FormControl variant="outlined" fullWidth size="small" margin="dense">
        <InputLabel>Price</InputLabel>
        <OutlinedInput
          label="Price"
          name="price"
          type="number"
          value={price}
          onChange={handleChange}
          endAdornment={<InputAdornment position="end">USDT</InputAdornment>}
        />
      </FormControl>
      <FormControl variant="outlined" fullWidth size="small" margin="dense">
        <InputLabel>Size</InputLabel>
        <OutlinedInput
          label="Size"
          name="size"
          type="number"
          value={size}
          onChange={handleChange}
        />
      </FormControl>
      <Stack direction="row" justifyContent="space-between" sx={{ paddingTop: 1 }}>
        <LoadingButton
          fullWidth
          variant="contained"
          color={side === OrderSide.BUY ? 'buy' : 'sell'}
          sx={{ textTransform: 'none' }}
          disabled={!enableSubmit()}
          loading={isLoading}
          onClick={handleSubmit}
        >
          {side === OrderSide.BUY ? 'Buy/Long' : 'Sell/Short'}
        </LoadingButton>
      </Stack>
      <FormControl variant="outlined" fullWidth size="small" margin="dense">
        <InputLabel>Entry</InputLabel>
        <OutlinedInput
          label="Entry"
          value={est.entry}
          disabled
          endAdornment={<InputAdornment position="end">USDT</InputAdornment>}
        />
      </FormControl>
    </Box>
  );
};

export default OrderForm;
