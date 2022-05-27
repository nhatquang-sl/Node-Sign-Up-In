import React, { useEffect, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { Box, Avatar, TextField, Grid } from '@mui/material';

// import LoadingButton from '@mui/lab/LoadingButton';

// import { validateEmailAddress } from 'shared/user/validate';
// import { closeSidebarAndHeader } from 'store/settings/actions';
// import { showSnackbar } from 'store/snackbar/actions';

import { Props, State, mapStateToProps, mapDispatchToProps } from './types';
import { getProfile } from 'store/auth/actions';
import { loading } from 'store/settings/actions';

const CssTextField = styled(TextField)({
  '& .Mui-disabled': {
    fontWeight: 'bold',
    color: 'black',
    '& fieldset': {
      border: 'none',
    },
  },
});

const Profile = (props: Props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { accessToken, firstName, lastName, emailAddress } = props.auth;

  let [gettingProfile, setGettingProfile] = useState(false);
  const [values, setValues] = useState<State>({
    firstName: firstName,
    firstNameError: '',
    lastName: lastName,
    lastNameError: '',
    emailAddress: emailAddress,
    emailAddressError: '',
    password: '',
    submitted: false,
  });

  useEffect(() => {
    console.log('Profile');
    if (!accessToken) navigate('/login'); // need to login
    else if (!gettingProfile) {
      // start getting profile
      setGettingProfile(() => true);
      dispatch(getProfile());
      dispatch(loading());
    } else if (gettingProfile && !props.auth.pendingGetProfile() && props.settings.loading) {
      // finish getting profile
      dispatch(loading(false));
    }

    // update message errors if need.
    const { firstNameError, lastNameError, emailAddressError, passwordError } = props.auth;
    setValues((v) => ({
      ...v,
      firstNameError,
      lastNameError,
      emailAddressError,
      passwordError,
    }));
  }, [props.settings.loading, props.auth, gettingProfile, accessToken, navigate, dispatch]);

  return (
    <Grid container spacing={2} justifyContent="center">
      <Grid item>
        <Avatar
          src={`https://joeschmoe.io/api/v1/male/${values.firstName}`}
          sx={{ width: 156, height: 156 }}
        />
      </Grid>
      <Grid item xs={12} sm={8}>
        <Box component="form" noValidate sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} justifyContent="center">
              <CssTextField
                fullWidth
                required
                disabled
                id="firstName"
                label="First Name"
                name="firstName"
                value={values.firstName}
                // onChange={handleChange('firstName')}
                error={!!values.firstNameError?.length}
                helperText={values.firstNameError}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CssTextField
                required
                fullWidth
                disabled
                id="lastName"
                label="Last Name"
                name="lastName"
                value={values.lastName}
                // onChange={handleChange('lastName')}
                error={!!values.lastNameError?.length}
                helperText={values.lastNameError}
              />
            </Grid>
            <Grid item xs={12}>
              <CssTextField
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                disabled
                value={values.emailAddress}
              />
            </Grid>
          </Grid>
        </Box>
      </Grid>
    </Grid>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
