import { useEffect } from 'react';
import { AxiosError, AxiosResponse } from 'axios';
import { connect } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { Container, Box } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';

import useApiService from 'hooks/use-api-service';
import { Props, mapStateToProps, mapDispatchToProps } from './types';
const RegisterConfirm = (props: Props) => {
  const { activationCode } = useParams();
  const navigate = useNavigate();
  const apiService = useApiService();

  useEffect(() => {
    console.log('register confirm');
    const registerConfirm = async () => {
      try {
        await apiService.get(`auth/activate/${activationCode}`);
      } catch (err) {
        if (err instanceof AxiosError) {
          const { data } = err.response as AxiosResponse<{ message: string }>;
          props.showSnackbar(data.message, 'error');
        }
      }
      navigate('/login', { replace: true });
    };

    registerConfirm();
  }, [activationCode, navigate, props, apiService]);

  return (
    <Container component="main" maxWidth="xs">
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    </Container>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(RegisterConfirm);
