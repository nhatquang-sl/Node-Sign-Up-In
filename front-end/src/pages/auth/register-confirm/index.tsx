import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { Container, Box, CircularProgress } from '@mui/material';

import { showSnackbar } from 'store/snackbar-slice';
import { useActivateMutation } from 'store/auth-api';
const RegisterConfirm = () => {
  const { activationCode } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [activate] = useActivateMutation();

  useEffect(() => {
    const registerConfirm = async () => {
      try {
        await activate(activationCode ?? '').unwrap();
        dispatch(showSnackbar('Activate your account success', 'success'));
      } catch (err) {
        const { message } = err as { message: string };
        dispatch(showSnackbar(message, 'error'));
      }
      navigate('/login', { replace: true });
    };

    registerConfirm();
  }, [activationCode, navigate, dispatch]);

  return (
    <Container component="main" maxWidth="xs">
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    </Container>
  );
};

export default RegisterConfirm;
