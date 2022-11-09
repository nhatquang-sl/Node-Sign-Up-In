import { useState } from 'react';
import { connect } from 'react-redux';
import { Container, Box } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';

import useApiService from 'hooks/use-api-service';

import { Props, mapStateToProps, mapDispatchToProps } from './types';

const RequestActivateEmail = (props: Props) => {
  const apiService = useApiService();
  const [loading, setLoading] = useState(false);

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
