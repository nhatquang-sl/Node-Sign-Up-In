import { useState } from 'react';
import { apiService } from 'store/services';
import useAuth from './use-auth';

const useRefreshToken = () => {
  const { auth, setAuth } = useAuth();
  const [refreshing, setRefreshing] = useState(false);

  const refresh = async () => {
    if (!refreshing) {
      setRefreshing(true);
      const res = await apiService.get('/auth/refresh-token', {
        withCredentials: true,
      });

      setAuth({ ...auth, accessToken: res.data.accessToken });
      setRefreshing(false);
      return res.data.accessToken;
    }
  };

  return { refreshing, refresh };
};

export default useRefreshToken;
