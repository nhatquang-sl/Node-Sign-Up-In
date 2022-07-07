import { useState, useEffect } from 'react';
import { connect, useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { Container, Box } from '@mui/material';
import { registerConfirm, logOut } from 'store/auth/actions';
import CircularProgress from '@mui/material/CircularProgress';

import { closeSidebarAndHeader } from 'store/settings/actions';

import { Props, mapStateToProps, mapDispatchToProps } from './types';

const RegisterConfirm = (props: Props) => {
  const { activateCode } = useParams();
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  console.log(activateCode);
  useEffect(() => {
    if (activateCode) {
      dispatch(logOut());
      dispatch(closeSidebarAndHeader());
      setSubmitted(true);
      dispatch(registerConfirm(activateCode));
    }
  }, [activateCode, navigate, dispatch]);

  useEffect(() => {
    console.log({ init: submitted, pending: props.auth.pendingRegisterConfirm() });
    if (submitted && !props.auth.pendingRegisterConfirm()) {
      navigate('/login');
    }
  }, [submitted, props.auth, navigate]);

  return (
    <Container component="main" maxWidth="xs">
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    </Container>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(RegisterConfirm);
