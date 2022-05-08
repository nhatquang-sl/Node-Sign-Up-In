import React, { useEffect } from 'react';
import { connect, useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { Container, Box } from '@mui/material';
import { registerConfirm } from 'store/auth/actions';
import CircularProgress from '@mui/material/CircularProgress';

import { openHeader } from 'store/settings/actions';

import { Props, mapStateToProps, mapDispatchToProps } from './types';

const RegisterConfirm = (props: Props) => {
  const { activateCode } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  console.log(activateCode);
  useEffect(() => {
    if (activateCode) {
      dispatch(registerConfirm(activateCode));
    }
  }, [activateCode, navigate, dispatch]);
  if (activateCode) {
    // props.registerConfirm(activateCode);
  }
  //   const navigate = useNavigate();
  //   const dispatch = useDispatch();

  //   const { accessToken } = props.auth;
  //   useEffect(() => {
  //     if (!accessToken) navigate('/login');
  //     else dispatch(openHeader());
  //   }, [accessToken, navigate, dispatch]);

  //   const handleSendActivateEmail = async () => {
  //     props.sendActivateLink();
  //   };

  return (
    <Container component="main" maxWidth="xs">
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    </Container>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(RegisterConfirm);
