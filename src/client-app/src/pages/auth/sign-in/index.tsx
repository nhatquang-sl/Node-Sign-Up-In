import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
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
  IconButton
} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';

import { API_ENDPOINT } from 'store/constants';
import { validateEmailAddress } from 'store/auth/validate';

import { Props, State, mapStateToProps, mapDispatchToProps } from './types';

const SignIn = (props: Props) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState<State>({
    emailAddress: 'sunlight479@yahoo.com',
    emailAddressError: undefined,
    password: '123456x@X',
    passwordError: undefined,
    showPassword: false
  });

  const { accessToken, emailConfirmed } = props.auth;
  useEffect(() => {
    if (accessToken && emailConfirmed) navigate('/');
    else if (accessToken) navigate('/request-activate-email');
    else props.closeSidebarAndHeader();
  }, [accessToken, emailConfirmed]);

  const handleClickShowPassword = () => {
    setValues({
      ...values,
      showPassword: !values.showPassword
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
    const passwordError = values.password ? undefined : 'Password is required';
    setValues({
      ...values,
      emailAddressError,
      passwordError
    });
    if (emailAddressError || passwordError) {
      setLoading(false);
      return;
    }
    try {
      const res = await axios.post(`${API_ENDPOINT}/auth/login`, {
        emailAddress: values.emailAddress,
        password: values.password
      });
      props.updateAuth(
        res.data.id,
        res.data.accessToken,
        res.data.firstName,
        res.data.lastName,
        res.data.emailAddress,
        res.data.emailConfirmed
      );
    } catch (err) {
      props.showSnackbar('Invalid email or password', 'error');
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
          alignItems: 'center'
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
          <Icon>lock</Icon>
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <Box component="form" noValidate sx={{ mt: 3 }} onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                value={values.emailAddress}
                onChange={handleChange('emailAddress')}
                error={
                  !!values.emailAddressError?.length || !!props.auth.errors['emailAddress']?.length
                }
                helperText={
                  !!props.auth.errors['emailAddress']?.length
                    ? props.auth.errors['emailAddress'][0]
                    : values.emailAddressError
                }
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl variant="outlined" required fullWidth error={!!values.passwordError}>
                <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                <OutlinedInput
                  id="outlined-adornment-password"
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
            Login
          </LoadingButton>
          <Grid container>
            <Grid item xs>
              <Link href="#" variant="body2">
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
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

export default connect(mapStateToProps, mapDispatchToProps)(SignIn);
