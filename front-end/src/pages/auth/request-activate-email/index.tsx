import React, { useEffect } from 'react';
import { connect, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Container, Box } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';

import { openHeader } from 'store/settings/actions';

import { Props, mapStateToProps, mapDispatchToProps } from './types';

const RequestActivateEmail = (props: Props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { accessToken } = props.auth;
  useEffect(() => {
    if (!accessToken) navigate('/login');
    else dispatch(openHeader());
  }, [accessToken, navigate, dispatch]);

  const handleSendActivateEmail = async () => {
    props.sendActivateLink();
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <LoadingButton
          loading={props.auth.pendingSendActivateLink()}
          onClick={handleSendActivateEmail}
        >
          Send active link to my email
        </LoadingButton>
      </Box>
    </Container>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(RequestActivateEmail);
