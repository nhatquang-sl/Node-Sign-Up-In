import React, { useEffect, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { AxiosError } from 'axios';
import {
  Container,
  Box,
  Avatar,
  Icon,
  Typography,
  TextField,
  FormHelperText,
  Grid,
  Link,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';

import { AuthState } from 'context/auth-provider';
import LANG from 'shared/lang';
import { validateEmailAddress } from 'shared/user';
import { apiService } from 'store/services';
import { closeSidebarAndHeader } from 'store/settings/actions';
import { showSnackbar } from 'store/snackbar/actions';
import useAuth from 'hooks/use-auth';

import { Props, State, mapStateToProps, mapDispatchToProps } from './types';

type LoginError = {
  message: string;
};

const Login = (props: Props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname ?? '/';

  const dispatch = useDispatch();
  const { setAuth } = useAuth();
  const [loading, setLoading] = useState(false);

  const [values, setValues] = useState<State>({
    emailAddress: '',
    emailAddressError: undefined,
    password: '',
    passwordError: undefined,
    showPassword: false,
  });

  useEffect(() => {
    if (process.env.REACT_APP_ENV === 'development' && !values.emailAddress && !values.password) {
      setValues((v) => ({
        ...v,
        emailAddress: 'sunlight479@yahoo.com',
        password: '123456x@X',
      }));
    }
  }, [values.emailAddress, values.password]);

  const { accessToken, emailConfirmed } = props.auth;
  const loginError = props.auth.error.login;

  useEffect(() => {
    if (accessToken && emailConfirmed) navigate('/');
    else if (accessToken) navigate('/request-activate-email');
    else dispatch(closeSidebarAndHeader());
  }, [accessToken, emailConfirmed, navigate, dispatch]);

  useEffect(() => {
    loginError && dispatch(showSnackbar(loginError, 'error'));
  }, [loginError, dispatch]);

  const handleClickShowPassword = () => {
    setValues({
      ...values,
      showPassword: !values.showPassword,
    });
  };

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const handleChange = (prop: keyof State) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    setLoading(true);

    const emailAddressError = validateEmailAddress(values.emailAddress);
    const passwordError = values.password ? undefined : LANG.USER_PASSWORD_MISSING_ERROR;
    setValues({ ...values, emailAddressError, passwordError });

    const isValid = !emailAddressError && !passwordError;
    if (isValid) {
      try {
        const res = await apiService.post(`auth/login`, values, {
          withCredentials: true,
        });

        setAuth(new AuthState(res.data.accessToken));
        const { accessToken, emailConfirmed } = res.data;

        if (accessToken && emailConfirmed) navigate(from, { replace: true });
        else if (accessToken) navigate('/request-activate-email');
      } catch (err) {
        const res = (err as AxiosError<LoginError>).response;
        const status = res?.status ?? 0;
        if ([400, 401].includes(status)) {
          const errMsg = res?.data.message;
          errMsg && dispatch(showSnackbar(errMsg, 'error'));
        }
      }
    }
    setLoading(false);
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
          <Icon>lock</Icon>
        </Avatar>
        <Typography component="h1" variant="h5">
          Login
        </Typography>
        <Box component="form" noValidate sx={{ mt: 3 }} onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="email"
                label="Email Address"
                type="email"
                name="email"
                autoComplete="email"
                value={values.emailAddress}
                onChange={handleChange('emailAddress')}
                error={!!values.emailAddressError?.length}
                helperText={values.emailAddressError}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl variant="outlined" required fullWidth error={!!values.passwordError}>
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
                <FormHelperText>{values.passwordError}</FormHelperText>
              </FormControl>
            </Grid>
          </Grid>
          <LoadingButton
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            loading={loading}
          >
            Submit
          </LoadingButton>
          <Grid container justifyContent="space-between">
            <Grid item md="auto" xs={12}>
              <Link href="forgot-password" variant="body2">
                Forgot password?
              </Link>
            </Grid>
            <Grid item md="auto" xs={12}>
              <Link href="register" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
