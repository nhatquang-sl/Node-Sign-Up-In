import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Container, Box } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';

import { selectAuthType } from 'store/auth-slice';
import { useSendActivateEmailMutation } from 'store/auth-api';
import { TokenType } from 'shared/user';

const RequestActivateEmail = () => {
  const navigate = useNavigate();
  const [sendActivateEmail, { isLoading }] = useSendActivateEmailMutation();
  const authType = useSelector(selectAuthType);

  useEffect(() => {
    switch (authType) {
      case TokenType.Login:
        navigate('/', { replace: true });
        break;
      case TokenType.NeedActivate:
        navigate('/request-activate-email', { replace: true });
        break;
    }
  }, [authType, navigate]);

  const handleSendActivateEmail = async () => {
    await sendActivateEmail();
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
        <LoadingButton loading={isLoading} onClick={handleSendActivateEmail}>
          Send active link to my email
        </LoadingButton>
      </Box>
    </Container>
  );
};

export default RequestActivateEmail;
