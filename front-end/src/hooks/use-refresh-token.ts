import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { apiService } from './use-api-service';
import { setAuth } from 'store/auth-slice';

export const useRefreshToken = () => {
  const dispatch = useDispatch();
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

    dispatch(setAuth(accessToken));
    setRefreshing(false);
    return accessToken;
  };

  return { refreshing, refresh };
};

export default useRefreshToken;
