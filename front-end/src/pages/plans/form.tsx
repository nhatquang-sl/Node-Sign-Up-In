import {
  Divider,
  FormControl,
  FormHelperText,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
} from '@mui/material';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { LoadingButton } from '@mui/lab';

import LANG from 'shared/lang';

const GridPlanSchema = z.object({
  lowerPrice: z.preprocess(
    Number,
    z.number().gt(0, { message: `${LANG.GRID_PLAN_LOWER_PRICE_GT_ERROR} ${0}` })
  ),
  upperPrice: z.preprocess(
    Number,
    z.number().gt(0, { message: `${LANG.GRID_PLAN_UPPER_PRICE_GT_ERROR} ${0}` })
  ),
  grid: z.preprocess(
    Number,
    z.number().gte(1, { message: `${LANG.GRID_PLAN_GRID_GTE_ERROR} ${1}` })
  ),
  gridMode: z.string(),
  investment: z.preprocess(
    Number,
    z.number().gte(5, { message: `${LANG.GRID_PLAN_INVESTMENT_GTE_ERROR} ${5}` })
  ),
});

type GridPlanFormValues = z.infer<typeof GridPlanSchema>;

const GridPlanForm = () => {
  const form = useForm<GridPlanFormValues>({
    defaultValues: {
      gridMode: 'arithmetic',
    },
    resolver: zodResolver(GridPlanSchema),
  });

  const { register, handleSubmit, formState, control } = form;
  const { errors } = formState;
  const onSubmit: SubmitHandler<GridPlanFormValues> = (data: GridPlanFormValues) => {
    console.log(data);
  };

  return (
    <Stack
      noValidate
      spacing={2}
      component="form"
      autoComplete="off"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        divider={
          <Divider sx={{ alignSelf: 'flex-start', paddingTop: '8.5px' }} flexItem>
            -
          </Divider>
        }
      >
        <FormControl
          variant="outlined"
          size="small"
          required
          error={!!errors.lowerPrice}
          sx={{ flexGrow: 1 }}
        >
          <InputLabel>Lower Price</InputLabel>
          <OutlinedInput
            label="Lower Price"
            type="number"
            {...register('lowerPrice', { required: 'Lower Price is required' })}
            endAdornment={<InputAdornment position="end">USDT</InputAdornment>}
          />
          {!!errors.lowerPrice && <FormHelperText>{errors.lowerPrice?.message}</FormHelperText>}
        </FormControl>
        <FormControl
          variant="outlined"
          size="small"
          required
          error={!!errors.upperPrice}
          sx={{ flexGrow: 1 }}
        >
          <InputLabel>Upper Price</InputLabel>
          <OutlinedInput
            label="Upper Price"
            type="number"
            {...register('upperPrice', { required: 'Upper Price is required' })}
            endAdornment={<InputAdornment position="end">USDT</InputAdornment>}
          />
          {!!errors.upperPrice && <FormHelperText>{errors.upperPrice?.message}</FormHelperText>}
        </FormControl>
      </Stack>
      <Stack direction="row" spacing={1}>
        <FormControl
          variant="outlined"
          size="small"
          required
          error={!!errors.grid}
          sx={{ flexGrow: 1 }}
        >
          <InputLabel>Grid</InputLabel>
          <OutlinedInput
            label="Grid"
            type="number"
            {...register('grid', { required: 'Grid is required', min: 1 })}
          />
          {!!errors.grid && <FormHelperText>{errors.grid?.message}</FormHelperText>}
        </FormControl>
        <FormControl variant="outlined" size="small">
          <InputLabel id="gridMode">Grid Mode</InputLabel>
          <Controller
            control={control}
            name="gridMode"
            render={({ field }) => (
              <Select labelId="gridMode" label="Grid Mode" {...field}>
                <MenuItem value={'arithmetic'}>Arithmetic</MenuItem>
                <MenuItem value={'geometric'}>Geometric</MenuItem>
              </Select>
            )}
          />
        </FormControl>
      </Stack>
      <Stack direction="row">
        <FormControl
          variant="outlined"
          size="small"
          required
          error={!!errors.investment}
          sx={{ flexGrow: 1 }}
        >
          <InputLabel>Investment</InputLabel>
          <OutlinedInput
            label="Investment"
            type="number"
            {...register('investment', { required: 'Investment is required' })}
            endAdornment={<InputAdornment position="end">USDT</InputAdornment>}
          />
          {!!errors.investment && <FormHelperText>{errors.investment?.message}</FormHelperText>}
        </FormControl>
      </Stack>

      <LoadingButton
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
        loading={false}
      >
        Submit
      </LoadingButton>
    </Stack>
  );
};

export default GridPlanForm;
