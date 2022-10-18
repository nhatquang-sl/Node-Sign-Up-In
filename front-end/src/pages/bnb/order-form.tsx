import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

const OrderForm = () => {
  return (
    <Box component="form" sx={{ width: 200 }} noValidate autoComplete="off">
      <FormControl variant="outlined" fullWidth size="small">
        <InputLabel>Price</InputLabel>
        <OutlinedInput
          label="Price"
          endAdornment={<InputAdornment position="end">USDT</InputAdornment>}
        />
      </FormControl>
      <FormControl variant="outlined" fullWidth size="small" margin="dense">
        <InputLabel>Size</InputLabel>
        <OutlinedInput
          label="Size"
          endAdornment={<InputAdornment position="end">USDT</InputAdornment>}
        />
      </FormControl>
      <Stack direction="row" justifyContent="space-between" sx={{ paddingTop: 1 }}>
        <Button variant="contained" color="buy" sx={{ textTransform: 'none' }}>
          Buy/Long
        </Button>
        <Button variant="contained" color="sell" sx={{ textTransform: 'none' }}>
          Sell/Short
        </Button>
      </Stack>
    </Box>
  );
};

export default OrderForm;
