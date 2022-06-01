import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Container, Box, Avatar, Icon, Typography, TextField, Grid } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';

import { validateEmailAddress } from 'shared/user/validate';

import { Props, State, mapStateToProps, mapDispatchToProps } from './types';

const ForgotPassword = (props: Props) => {
  const THRESHOLD_SECONDS = 10;
  const DEFAULT_COUNTDOWN = -1;

  const { lastDateResetPassword } = props.auth;

  const [countdown, setCountdown] = useState<number>(DEFAULT_COUNTDOWN);
  const [values, setValues] = useState<State>(new State());

  const calculateDiffLastTime = React.useCallback(
    () => Math.floor((new Date().getTime() - lastDateResetPassword) / 1000),
    [lastDateResetPassword]
  );

  React.useEffect(() => {
    let seconds = calculateDiffLastTime();
    if (THRESHOLD_SECONDS - seconds > 0) {
      const timer = setInterval(() => {
        seconds = calculateDiffLastTime();
        if (THRESHOLD_SECONDS - seconds > DEFAULT_COUNTDOWN - 1)
          setCountdown(() => THRESHOLD_SECONDS - seconds);
        else clearInterval(timer);
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [lastDateResetPassword, DEFAULT_COUNTDOWN, calculateDiffLastTime]);

  React.useEffect(() => {
    setValues((v) => ({ ...v, emailAddressError: props.auth.emailAddressError }));
  }, [props.auth.emailAddressError]);

  const handleChange = (prop: keyof State) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [prop]: event.target.value });

    if (values.submitted) {
      const emailAddressError = validateEmailAddress(event.target.value);
      setValues({
        ...values,
        [prop]: event.target.value,
        emailAddressError,
      });
    }
  };

  const handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();

    const emailAddressError = validateEmailAddress(values.emailAddress);

    setValues({
      ...values,
      emailAddressError,
      submitted: true,
    });

    if (emailAddressError) return;
    props.getSendEmailResetPassword(values.emailAddress);
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
        <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
          <Icon>lock_reset</Icon>
        </Avatar>
        <Typography component="h1" variant="h5">
          Forgot Password
        </Typography>
        <Box component="form" noValidate sx={{ mt: 3, minWidth: '100%' }} onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                autoFocus
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
          </Grid>

          <LoadingButton
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            loading={
              props.auth.pendingSendEmailResetPassword() ||
              THRESHOLD_SECONDS - calculateDiffLastTime() > DEFAULT_COUNTDOWN
            }
            loadingPosition={props.auth.pendingSendEmailResetPassword() ? 'center' : 'start'}
            startIcon={<div></div>}
          >
            {countdown > DEFAULT_COUNTDOWN ? countdown : 'Submit'}
          </LoadingButton>
        </Box>
      </Box>
    </Container>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(ForgotPassword);
