import React, { useEffect, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

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

import { validateEmailAddress } from 'shared/user/validate';
import { closeSidebarAndHeader } from 'store/settings/actions';
import { showSnackbar } from 'store/snackbar/actions';

import { Props, State, mapStateToProps, mapDispatchToProps } from './types';

const Login = (props: Props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [values, setValues] = useState<State>({
    // emailAddress: 'sunlight479@yahoo.com',
    emailAddress: '',
    emailAddressError: undefined,
    // password: '12i3456x@X',
    password: '',
    passwordError: undefined,
    showPassword: false,
  });

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

    const emailAddressError = validateEmailAddress(values.emailAddress);
    const passwordError = values.password ? undefined : 'Password is required';
    setValues({
      ...values,
      emailAddressError,
      passwordError,
    });

    if (emailAddressError || passwordError) return;

    props.login(values);
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
            loading={props.auth.pendingLogin()}
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
