import { useState } from 'react';
import { connect } from 'react-redux';
import { styled } from '@mui/material/styles';
import { Box, Avatar, TextField, Grid } from '@mui/material';

import { useAuth } from 'hooks';

import { Props, State, mapStateToProps, mapDispatchToProps } from './types';

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
  const { auth } = useAuth();
  const { firstName, lastName, emailAddress } = auth;

  const [values] = useState<State>({
    firstName: firstName,
    firstNameError: '',
    lastName: lastName,
    lastNameError: '',
    emailAddress: emailAddress,
    emailAddressError: '',
    password: '',
    submitted: false,
  });

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
