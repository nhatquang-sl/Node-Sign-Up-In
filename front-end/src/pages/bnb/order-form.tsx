import { useEffect, useState } from 'react';
import {
  Box,
  OutlinedInput,
  InputAdornment,
  InputLabel,
  FormControl,
  Stack,
  Typography,
} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { useApiService } from 'hooks';
import { OrderFormProps } from './types';
import { round2Dec } from 'shared/utilities';

const OrderForm = (props: OrderFormProps) => {
  const [price, setPrice] = useState('');
  const [size, setSize] = useState('');
  const [submitting, setSubmitting] = useState<'buy' | 'sell' | ''>('');
  const apiService = useApiService();
  useEffect(() => {
    setPrice(props.liqEstimate + '');
  }, [props.liqEstimate]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let value = event.target.value;

    switch (event.target.name) {
      case 'price':
        setPrice(value);
        break;
      case 'size':
        setSize(value);
        break;
    }
    // console.log(event.target.name, event.target.value);
  };

  const handleSubmit = async (event: React.SyntheticEvent) => {
    const txtBtn = (event.currentTarget.textContent ?? '').toLocaleLowerCase();
    const orderData = {
      symbol: 'NEARUSDT',
      price: parseFloat(price),
      quantity: parseFloat(size),
      side: '',
    };

    if (txtBtn.includes('buy')) {
      setSubmitting('buy');
      orderData.side = 'BUY';
    } else if (txtBtn.includes('sell')) {
      setSubmitting('sell');
      orderData.side = 'SELL';
    }
    try {
      const res = await apiService.post('bnb/order', orderData);
      props.onSuccess(res.data);
    } catch (err) {}
    setSubmitting('');
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
          variant="contained"
          color="buy"
          sx={{ textTransform: 'none' }}
          disabled={!enableSubmit()}
          loading={submitting === 'buy'}
          onClick={handleSubmit}
        >
          Buy/Long
        </LoadingButton>
        <LoadingButton
          variant="contained"
          color="sell"
          sx={{ textTransform: 'none', marginLeft: 1 }}
          disabled={!enableSubmit()}
          loading={submitting === 'sell'}
          onClick={handleSubmit}
        >
          Sell/Short
        </LoadingButton>
      </Stack>
    </Box>
  );
};

export default OrderForm;
