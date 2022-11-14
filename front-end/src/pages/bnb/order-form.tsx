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
import { useApiService } from 'hooks';
import { OrderFormProps } from './types';
import { round2Dec } from 'shared/utilities';

const OrderForm = (props: OrderFormProps) => {
  const [price, setPrice] = useState('');
  const [size, setSize] = useState(localStorage.orderSize ?? '');
  const [submitting, setSubmitting] = useState(false);
  const apiService = useApiService();
  useEffect(() => {
    setPrice(props.liqEstimate + '');
  }, [props.liqEstimate]);

  const handleSelectChange = (event: SelectChangeEvent) => {
    let value = event.target.value;
    switch (event.target.name) {
      case 'side':
        props.onChangeSide(value);
        break;
      case 'symbol':
        props.onChangeSymbol(value);
        break;
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let value = event.target.value;
    console.log(value, event.target.name);
    switch (event.target.name) {
      case 'price':
        setPrice(value);
        break;
      case 'size':
        localStorage.orderSize = value;
        setSize(value);
        break;
    }
    // console.log(event.target.name, event.target.value);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const res = await apiService.post('bnb/order', {
        symbol: props.symbol.toUpperCase(),
        price: parseFloat(price),
        quantity: parseFloat(size),
        side: props.side.toUpperCase(),
      });
      props.onSuccess(res.data);
    } catch (err) {}
    setSubmitting(false);
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
        Avbl: {round2Dec(props.usdtAvailable)} USDT
      </Typography>
      <FormControl variant="outlined" fullWidth size="small">
        <InputLabel>Symbol</InputLabel>
        <Select label="Symbol" name="symbol" value={props.symbol} onChange={handleSelectChange}>
          <MenuItem value={'nearusdt'}>NEARUSDT</MenuItem>
          <MenuItem value={'c98usdt'}>C98USDT</MenuItem>
        </Select>
      </FormControl>
      <FormControl variant="outlined" fullWidth size="small" margin="dense">
        <InputLabel>Side</InputLabel>
        <Select label="Side" name="side" value={props.side} onChange={handleSelectChange}>
          <MenuItem value={'buy'}>Long</MenuItem>
          <MenuItem value={'sell'}>Short</MenuItem>
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
          endAdornment={<InputAdornment position="end">USDT</InputAdornment>}
        />
      </FormControl>
      <Stack direction="row" justifyContent="space-between" sx={{ paddingTop: 1 }}>
        <LoadingButton
          fullWidth
          variant="contained"
          color={props.side}
          sx={{ textTransform: 'none' }}
          disabled={!enableSubmit()}
          loading={submitting}
          onClick={handleSubmit}
        >
          {props.side === 'buy' ? 'Buy/Long' : 'Sell/Short'}
        </LoadingButton>
      </Stack>
    </Box>
  );
};

export default OrderForm;
