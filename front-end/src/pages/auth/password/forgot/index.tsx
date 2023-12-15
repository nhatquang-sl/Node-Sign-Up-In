import { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Container, Box, Avatar, Icon, Typography, TextField, Grid } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';

import { TokenType, validateEmailAddress } from 'shared/user';
import { FORGOT_PASSWORD_WAIT_SECONDS } from 'shared/constant';
import { selectAuthType } from 'store/auth-slice';
import { useForgotPasswordMutation } from 'store/auth-api';
import { State } from './types';

const ForgotPassword = () => {
  const DEFAULT_COUNTDOWN = 0;

  const navigate = useNavigate();
  const authType = useSelector(selectAuthType);
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const [countdown, setCountdown] = useState(DEFAULT_COUNTDOWN);
  const [values, setValues] = useState(new State());
  const [lastDate, setLastDate] = useState(0);

  const calculateCountdownSeconds = useCallback(
    () => FORGOT_PASSWORD_WAIT_SECONDS - Math.floor((new Date().getTime() - lastDate) / 1000),
    [lastDate]
  );

  useEffect(() => {
    switch (authType) {
      case TokenType.Login:
        navigate('/', { replace: true });
        break;
      case TokenType.NeedActivate:
        navigate('/request-activate-email', { replace: true });
        break;
    }
  }, [authType, navigate]);

  useEffect(() => {
    let seconds = calculateCountdownSeconds();
    if (seconds > DEFAULT_COUNTDOWN) {
      setCountdown(seconds);
      const timer = setInterval(() => {
        seconds = calculateCountdownSeconds();
        if (seconds >= DEFAULT_COUNTDOWN) setCountdown(seconds);
        else clearInterval(timer);
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [lastDate, DEFAULT_COUNTDOWN, calculateCountdownSeconds]);

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

    try {
      const res = await forgotPassword(values.emailAddress).unwrap();
      const { lastDate } = res;
      setLastDate(lastDate);
    } catch (err) {
      const { message } = err as { message: string };
      setValues((v) => ({ ...v, emailAddressError: message }));
    }
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
            loading={isLoading || countdown > DEFAULT_COUNTDOWN}
            loadingPosition={isLoading ? 'center' : 'start'}
            startIcon={<div></div>}
          >
            {countdown > DEFAULT_COUNTDOWN ? countdown : 'Submit'}
          </LoadingButton>
        </Box>
      </Box>
    </Container>
  );
};

export default ForgotPassword;
