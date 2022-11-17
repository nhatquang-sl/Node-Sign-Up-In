import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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

import { validateUserRegister, UserRegisterDto, TokenType } from 'shared/user';
import { useApiService } from 'hooks';

import { AxiosError, AxiosResponse } from 'axios';
import { RootState } from 'store';
import { setAuth } from 'store/auth-slice';

interface State extends UserRegisterDto {
  firstNameError: string | undefined;
  lastNameError: string | undefined;
  emailAddressError: string | undefined;
  passwordError: string[];
  showPassword: boolean;
  submitted: boolean;
}

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const apiService = useApiService();
  const [submitting, setSubmitting] = useState(false);
  const auth = useSelector((state: RootState) => state.auth);
  // const { auth, setAuth } = useAuth();

  const [values, setValues] = useState<State>({
    firstName: process.env.REACT_APP_ENV === 'development' ? 'quang' : '',
    firstNameError: '',
    lastName: process.env.REACT_APP_ENV === 'development' ? 'nguyen' : '',
    lastNameError: '',
    emailAddress: process.env.REACT_APP_ENV === 'development' ? 'sunlight479@yahoo.com' : '',
    emailAddressError: '',
    password: process.env.REACT_APP_ENV === 'development' ? '123456x@X' : '',
    passwordError: [],
    showPassword: false,
    submitted: false,
  });

  useEffect(() => {
    switch (auth.type) {
      case TokenType.Login:
        navigate('/', { replace: true });
        break;
      case TokenType.NeedActivate:
        navigate('/request-activate-email', { replace: true });
        break;
    }
  }, [auth.type, navigate]);

  const handleChange = (prop: keyof State) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [prop]: event.target.value });

    if (values.submitted) {
      const { firstNameError, lastNameError, emailAddressError, passwordError } =
        validateUserRegister({ ...values, [prop]: event.target.value });
      setValues({
        ...values,
        [prop]: event.target.value,
        firstNameError,
        lastNameError,
        emailAddressError,
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

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const handleSubmit = async (event: React.SyntheticEvent) => {
    setSubmitting(true);
    event.preventDefault();

    const { firstNameError, lastNameError, emailAddressError, passwordError } =
      validateUserRegister(values);

    setValues({
      ...values,
      firstNameError,
      lastNameError,
      emailAddressError,
      passwordError,
      submitted: true,
    });

    if (firstNameError || lastNameError || emailAddressError || passwordError.length) {
      setSubmitting(false);
      return;
    }

    try {
      const res = await apiService.post(`auth/register`, new UserRegisterDto(values));
      dispatch(setAuth(res.data.accessToken));
    } catch (err) {
      if (err instanceof AxiosError) {
        const { data } = err.response as AxiosResponse<State>;
        const { firstNameError, lastNameError, emailAddressError, passwordError } = data;
        setValues({
          ...values,
          firstNameError,
          lastNameError,
          emailAddressError,
          passwordError: passwordError ?? [],
        });
      }
    }
    setSubmitting(false);
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
          Sign up
        </Typography>
        <Box component="form" noValidate sx={{ mt: 3 }} onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                autoComplete="given-name"
                name="firstName"
                required
                fullWidth
                id="firstName"
                label="First Name"
                autoFocus
                value={values.firstName}
                onChange={handleChange('firstName')}
                error={!!values.firstNameError?.length}
                helperText={values.firstNameError}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="lastName"
                label="Last Name"
                name="lastName"
                autoComplete="family-name"
                value={values.lastName}
                onChange={handleChange('lastName')}
                error={!!values.lastNameError?.length}
                helperText={values.lastNameError}
              />
            </Grid>
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
                error={!!values.emailAddressError?.length}
                helperText={values.emailAddressError}
              />
            </Grid>
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
            loading={submitting}
          >
            Submit
          </LoadingButton>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link href="/login" variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default Register;
