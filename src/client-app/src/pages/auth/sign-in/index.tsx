import React from 'react';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Avatar,
  Icon,
  Typography,
  TextField,
  FormControlLabel,
  Checkbox,
  Button,
  Grid,
  Link
} from '@mui/material';

import { Props, mapStateToProps, mapDispatchToProps } from './types';

const SignIn = (props: Props) => {
  const navigate = useNavigate();

  const { accessToken, emailConfirmed } = props.auth;
  if (accessToken && emailConfirmed) navigate('/');
  else if (accessToken) navigate('/request-activate-email');
  else props.closeSidebarAndHeader();

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
        <Box component="form" noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
          />
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            Sign In
          </Button>
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
