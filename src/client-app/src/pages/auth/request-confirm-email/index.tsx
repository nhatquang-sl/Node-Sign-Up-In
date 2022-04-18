import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Container, Box, Button } from '@mui/material';

import { Props, mapStateToProps, mapDispatchToProps } from './types';

const RequestConfirmEmail = (props: Props) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!props.auth.accessToken?.length) navigate('/login');
    else props.openHeader();
  }, []);

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <Button>Send active link to my email</Button>
      </Box>
    </Container>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(RequestConfirmEmail);
