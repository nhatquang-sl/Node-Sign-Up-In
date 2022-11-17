import { AxiosError } from 'axios';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  FormControl,
  Icon,
  InputLabel,
  OutlinedInput,
  Grid,
  InputAdornment,
  IconButton,
  FormHelperText,
} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';

import LANG from 'shared/lang';
import { validatePassword } from 'shared/user/validate';
import { useApiService } from 'hooks';
import { showSnackbarError, showSnackbarSuccess } from 'store/snackbar-slice';

class State {
  password: string = '';
  passwordError: string[] = [];
  showPassword: boolean = false;
  submitted: boolean = false;
  submitting: boolean = false;
}

const ResetPassword = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const apiService = useApiService();
  const { token } = useParams();
  const [values, setValues] = useState<State>({
    password: process.env.REACT_APP_ENV === 'development' ? '123456x@X' : '',
    passwordError: [],
    showPassword: false,
    submitted: false,
    submitting: false,
  });

  const handleChange = (prop: keyof State) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [prop]: event.target.value });

    if (values.submitted) {
      const passwordError = validatePassword(event.target.value);
      setValues({
        ...values,
        [prop]: event.target.value,
        passwordError,
      });
    }
  };
  const handleClickShowPassword = () => {
    setValues({
      ...values,
      showPassword: !values.showPassword,
    });
  };

  const handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    const passwordError = validatePassword(values.password);

    setValues({ ...values, submitted: true, passwordError });

    if (passwordError.length) return;
    setValues({ ...values, submitted: true, submitting: true });

    try {
      await apiService.post(`auth/reset-password/set-new`, {
        token,
        password: values.password,
      });
      setValues({ ...values, submitting: false });
      dispatch(showSnackbarSuccess(LANG.USER_RESET_PASSWORD_SUCCESS));
      navigate('/login', { replace: true });
    } catch (err) {
      if (err instanceof AxiosError) {
        const { message, passwordError } = err.response?.data;
        message && dispatch(showSnackbarError(message));
        setValues({ ...values, submitting: false, passwordError: passwordError ?? [] });
      }
    }
  };

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };
  return (
    <Container component="main" maxWidth="xs" fixed>
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Box component="form" noValidate sx={{ mt: 3, minWidth: '100%' }} onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControl
                variant="outlined"
                required
                fullWidth
                error={!!values.passwordError.length}
              >
                <InputLabel htmlFor="password">Password</InputLabel>
                <OutlinedInput
                  id="password"
                  type={values.showPassword ? 'text' : 'password'}
                  value={values.password}
                  onChange={handleChange('password')}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        <Icon> {values.showPassword ? 'visibility_off' : 'visibility'}</Icon>
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Password"
                />
                {values.passwordError.map((e, i) => (
                  <FormHelperText key={i}>{e}</FormHelperText>
                ))}
              </FormControl>
            </Grid>
          </Grid>
          <LoadingButton
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            loading={values.submitting}
          >
            Submit
          </LoadingButton>
        </Box>
      </Box>
    </Container>
  );
};

export default ResetPassword;
