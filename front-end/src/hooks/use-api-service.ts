import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios, { AxiosError, AxiosRequestHeaders, AxiosResponse } from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { API_ENDPOINT } from 'store/constants';
import useRefreshToken from './use-refresh-token';
import { RootState } from 'store';

export const apiService = axios.create({
  baseURL: API_ENDPOINT,
  withCredentials: true,
});

export const useApiService = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { refresh } = useRefreshToken();

  const auth = useSelector((state: RootState) => state.auth);

  const buildHeaders = (accessToken: string, headers: AxiosRequestHeaders = {}) => {
    return {
      ...(headers ?? {}),
      Authorization: `Bearer ${accessToken}`,
    } as AxiosRequestHeaders;
  };

  useEffect(() => {
    const reqIntercept = apiService.interceptors.request.use(
      (config) => {
        if (!config.headers?.Authorization && auth.accessToken)
          config.headers = buildHeaders(auth.accessToken, config.headers);
        return config;
      },
      (err) => {
        Promise.reject(err);
      }
    );

    const resIntercept = apiService.interceptors.response.use(
      (res) => res,
      async (err: AxiosError) => {
        const prevRequest = err?.config;

        const { status, data } = err?.response as AxiosResponse<{ message: string }>;
        const { message } = data;

        if (status === 401 && message === 'Access Token Expired') {
          const newAccessToken = await refresh();
          prevRequest.headers = buildHeaders(newAccessToken, prevRequest.headers);

          return apiService(prevRequest);
        } else if (status === 401) navigate('/login', { state: { from: location }, replace: true });

        return Promise.reject(err);
      }
    );

    return () => {
      apiService.interceptors.request.eject(reqIntercept);
      apiService.interceptors.response.eject(resIntercept);
    };
  }, [auth.accessToken, location, refresh, navigate]);

  return apiService;
};

export default useApiService;
