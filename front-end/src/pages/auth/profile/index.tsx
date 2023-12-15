import { useSelector } from 'react-redux';
import { styled } from '@mui/material/styles';
import { Box, Avatar, TextField, Grid } from '@mui/material';

import { selectAuth } from 'store/auth-slice';

const CssTextField = styled(TextField)({
  '& .Mui-disabled': {
    fontWeight: 'bold',
    color: 'black',
    '& fieldset': {
      border: 'none',
    },
  },
});

const Profile = () => {
  const auth = useSelector(selectAuth);
  const { firstName, lastName, emailAddress } = auth;

  return (
    <Grid container spacing={2} justifyContent="center">
      <Grid item>
        <Avatar
          src={`https://joeschmoe.io/api/v1/male/${firstName}`}
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
                value={firstName}
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
                value={lastName}
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
                value={emailAddress}
              />
            </Grid>
          </Grid>
        </Box>
      </Grid>
    </Grid>
  );
};

export default Profile;
