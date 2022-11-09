import { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Container, Box } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';

import { useAuth, useApiService } from 'hooks';

import { Props, mapStateToProps, mapDispatchToProps } from './types';
import { TokenType } from 'shared/user';

const RequestActivateEmail = (props: Props) => {
  const navigate = useNavigate();
  const apiService = useApiService();
  const [loading, setLoading] = useState(false);
  const { auth } = useAuth();

  useEffect(() => {
    switch (auth.type) {
      case TokenType.Login:
        navigate('/', { replace: true });
        break;
      case TokenType.NeedActivate:
        navigate('/request-activate-email', { replace: true });
        break;
    }
  }, [auth.type, navigate]);

  const handleSendActivateEmail = async () => {
    setLoading(true);
    try {
      await apiService.post(`auth/send-activation-email`);
    } catch (err) {}
    setLoading(false);
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
        <LoadingButton loading={loading} onClick={handleSendActivateEmail}>
          Send active link to my email
        </LoadingButton>
      </Box>
    </Container>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(RequestActivateEmail);
