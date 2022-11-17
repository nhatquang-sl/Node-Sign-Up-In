import { useEffect } from 'react';
import { AxiosError, AxiosResponse } from 'axios';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { Container, Box } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';

import useApiService from 'hooks/use-api-service';

import { showSnackbarError, showSnackbarSuccess } from 'store/snackbar-slice';
const RegisterConfirm = () => {
  const { activationCode } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const apiService = useApiService();

  useEffect(() => {
    const registerConfirm = async () => {
      try {
        await apiService.get(`auth/activate/${activationCode}`);
        dispatch(showSnackbarSuccess('Activate your account success'));
      } catch (err) {
        if (err instanceof AxiosError) {
          const { data } = err.response as AxiosResponse<{ message: string }>;
          dispatch(showSnackbarError(data.message));
        }
      }
      navigate('/login', { replace: true });
    };

    registerConfirm();
  }, [activationCode, navigate, dispatch, apiService]);

  return (
    <Container component="main" maxWidth="xs">
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    </Container>
  );
};

export default RegisterConfirm;
