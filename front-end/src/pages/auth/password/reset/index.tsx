import React, { useState, useEffect } from 'react';
import { connect, useDispatch } from 'react-redux';
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
import { showSnackbar } from 'store/snackbar/actions';

import { validatePassword } from 'shared/user/validate';

import { Props, State, mapStateToProps, mapDispatchToProps } from './types';

const ResetPassword = (props: Props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token } = useParams();
  const [values, setValues] = useState<State>({
    password: '123456x@X',
    passwordError: [],
    showPassword: false,
    submitted: false,
    loading: false,
  });

  useEffect(() => {
    props.auth.error.message && dispatch(showSnackbar(props.auth.error.message, 'error'));
  }, [props.auth.error.message, dispatch]);

  useEffect(() => {
    setValues((v) => ({ ...v, passwordError: props.auth.error.password }));
  }, [props.auth.error.password]);

  useEffect(() => {
    const { password, message } = props.auth.error;
    let loading = values.loading;
    if (loading !== props.auth.pendingSetNewPassword()) {
      setValues((v) => ({ ...v, loading: !loading }));
    }

    if (
      values.submitted &&
      loading &&
      !password.length &&
      !message &&
      !props.auth.pendingSetNewPassword() &&
      !props.global.errNetwork
    )
      navigate('/login');
  }, [props.auth, values.submitted, values.loading, navigate]);

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

  const handleSubmit = (event: React.SyntheticEvent) => {
    event.preventDefault();
    const passwordError = validatePassword(values.password);

    setValues({ ...values, passwordError, submitted: true });

    if (passwordError.length) return;
    // console.log({ token, password: values.password });
    props.setNewPassword(token ?? '', values.password);
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
            loading={props.auth.pendingSetNewPassword()}
          >
            Submit
          </LoadingButton>
        </Box>
      </Box>
    </Container>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(ResetPassword);
