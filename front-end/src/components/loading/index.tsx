import { CircularProgress, Backdrop } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from 'store';

const Loading = () => {
  const loading = useSelector((state: RootState) => state.settings.loading);
  return (
    <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
      <CircularProgress color="inherit" />
    </Backdrop>
  );
};

export default Loading;
