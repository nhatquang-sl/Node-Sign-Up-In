import React, { useState } from 'react';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_ENDPOINT } from 'store/constants';
import { Container, Box } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';

import { Props, mapStateToProps, mapDispatchToProps } from './types';

const RequestActivateEmail = (props: Props) => {
  const navigate = useNavigate();
  if (!props.auth.accessToken) navigate('/login');
  else props.openHeader();
  const [loading, setLoading] = useState(false);

  const handleSendActivateEmail = async () => {
    setLoading(true);
    try {
      await axios.post(`${API_ENDPOINT}/auth/send-activate-link`);
    } catch (err) {}
    setLoading(false);
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <LoadingButton loading={loading} onClick={handleSendActivateEmail}>
          Send active link to my email
        </LoadingButton>
      </Box>
    </Container>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(RequestActivateEmail);
