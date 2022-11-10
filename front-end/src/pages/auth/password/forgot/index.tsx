import { AxiosError } from 'axios';
import { useState, useEffect, useCallback } from 'react';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Container, Box, Avatar, Icon, Typography, TextField, Grid } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { useAuth, useApiService } from 'hooks';
import { validateEmailAddress } from 'shared/user/validate';

import { TokenType } from 'shared/user';
import { FORGOT_PASSWORD_WAIT_SECONDS } from 'shared/constant';
import { Props, State, mapStateToProps, mapDispatchToProps } from './types';

const ForgotPassword = (props: Props) => {
  const DEFAULT_COUNTDOWN = 0;

  const navigate = useNavigate();
  const { auth } = useAuth();
  const apiService = useApiService();

  const [countdown, setCountdown] = useState(DEFAULT_COUNTDOWN);
  const [values, setValues] = useState(new State());
  const [lastDate, setLastDate] = useState(0);

  const calculateCountdownSeconds = useCallback(
    () => FORGOT_PASSWORD_WAIT_SECONDS - Math.floor((new Date().getTime() - lastDate) / 1000),
    [lastDate]
  );

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
    setValues({ ...values, submitting: true });
    try {
      const res = await apiService.post(`auth/reset-password/send-email`, {
        emailAddress: values.emailAddress,
      });

      const { lastDate } = res.data;
      setLastDate(lastDate);
      setValues({ ...values, submitting: false });
    } catch (err) {
      if (err instanceof AxiosError) {
        const { message } = err.response?.data;
        setValues((v) => ({ ...v, emailAddressError: message, submitting: false }));
      }
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
            loading={values.submitting || countdown > DEFAULT_COUNTDOWN}
            loadingPosition={values.submitting ? 'center' : 'start'}
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
