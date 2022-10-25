import { useEffect, useCallback, useState } from 'react';
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { Typography } from '@mui/material';
import { apiService } from 'store/services';
import { OrderFormProps } from './types';
import { round2Dec } from 'shared/utilities';

const OrderForm = (props: OrderFormProps) => {
  const [price, setPrice] = useState('');
  const [size, setSize] = useState('');
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

    if (txtBtn.includes('buy')) orderData.side = 'BUY';
    else if (txtBtn.includes('sell')) orderData.side = 'SELL';

    const res = await apiService.post('bnb/order', orderData);
    props.onSuccess(res.data);
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
        <Button
          variant="contained"
          color="buy"
          sx={{ textTransform: 'none' }}
          onClick={handleSubmit}
        >
          Buy/Long
        </Button>
        <Button
          variant="contained"
          color="sell"
          sx={{ textTransform: 'none', marginLeft: 1 }}
          onClick={handleSubmit}
        >
          Sell/Short
        </Button>
      </Stack>
    </Box>
  );
};

export default OrderForm;
