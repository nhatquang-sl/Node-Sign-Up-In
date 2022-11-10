import { useState } from 'react';
import { apiService } from 'store/services';
import useAuth from './use-auth';
import { AuthState } from 'context/auth-provider';

export const useRefreshToken = () => {
  const { setAuth } = useAuth();
  const [refreshing, setRefreshing] = useState(false);

  const refresh = async () => {
    let accessToken = '';
    if (refreshing) return accessToken;

    setRefreshing(true);
    try {
      const res = await apiService.get('/auth/refresh-token', {
        withCredentials: true,
      });
      accessToken = res.data.accessToken;
    } catch (err) {}

    setAuth(new AuthState(accessToken));
    setRefreshing(false);
    return accessToken;
  };

  return { refreshing, refresh };
};

export default useRefreshToken;
