import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
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
  IconButton
} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';

import {
  validateFirstName,
  validateLastName,
  validateEmailAddress,
  validatePassword
} from 'store/auth/validate';

import { User } from 'store/auth/types';

import { Props, mapStateToProps, mapDispatchToProps } from './types';

interface State {
  firstName: string;
  firstNameError: string | undefined;
  lastName: string;
  lastNameError: string | undefined;
  emailAddress: string;
  emailAddressError: string | undefined;
  password: string;
  passwordError: string[];
  showPassword: boolean;
}

const SignUp = (props: Props) => {
  const navigate = useNavigate();

  const { accessToken, emailConfirmed } = props.auth;
  useEffect(() => {
    if (accessToken && emailConfirmed) navigate('/');
    else if (accessToken) navigate('/request-activate-email');
    else props.closeSidebarAndHeader();
  }, [accessToken, emailConfirmed]);

  const [values, setValues] = useState<State>({
    firstName: 'quang',
    firstNameError: undefined,
    lastName: 'nguyen',
    lastNameError: undefined,
    emailAddress: 'sunlight479@yahoo.com',
    emailAddressError: undefined,
    password: '123456x@X',
    passwordError: [],
    showPassword: false
  });

  const handleChange = (prop: keyof State) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const handleClickShowPassword = () => {
    setValues({
      ...values,
      showPassword: !values.showPassword
    });
  };

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const handleSubmit = (event: React.SyntheticEvent) => {
    event.preventDefault();

    const firstNameError = validateFirstName(values.firstName);
    const lastNameError = validateLastName(values.lastName);
    const emailAddressError = validateEmailAddress(values.emailAddress);
    const passwordError = validatePassword(values.password);
    setValues({
      ...values,
      firstNameError,
      lastNameError,
      emailAddressError,
      passwordError
    });

    const user = new User();
    user.emailAddress = values.emailAddress;
    user.firstName = values.firstName;
    user.lastName = values.lastName;
    user.password = values.password;
    props.signUp(user);
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
        <div>No User</div>
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
              <FormControl
                variant="outlined"
                required
                fullWidth
                error={!!values.passwordError.length}
              >
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
            loading={props.auth.pendingSignUp()}
          >
            Sign Up
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

export default connect(mapStateToProps, mapDispatchToProps)(SignUp);
