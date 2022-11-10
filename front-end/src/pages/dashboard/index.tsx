import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { openHeader } from 'store/settings/actions';
import { connect } from 'react-redux';
import useApiService from 'hooks/use-api-service';
import LoadingButton from '@mui/lab/LoadingButton';
import { Props, mapStateToProps, mapDispatchToProps } from './types';

const Dashboard = (props: Props) => {
  const dispatch = useDispatch();
  const apiService = useApiService();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    dispatch(openHeader());
  }, [dispatch]);

  const getSessions = async () => {
    try {
      setLoading(true);
      const res = await apiService.get(`user/sessions`);
      console.log(res.data);
    } catch (err) {
      console.log({ err });
    }
    setLoading(false);
  };

  return (
    <div>
      <LoadingButton
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
        loading={loading}
        onClick={getSessions}
      >
        Get Sessions
      </LoadingButton>
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
