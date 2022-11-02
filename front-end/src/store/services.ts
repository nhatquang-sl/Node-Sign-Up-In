import axios, { AxiosInstance, AxiosError, AxiosRequestConfig } from 'axios';
import store from 'store';
import { showSnackbar } from './snackbar/actions';
import { logOut } from './auth/actions';
import { errNetwork } from './global/actions';
import { API_ENDPOINT } from 'store/constants';

const apiService = axios.create({
  baseURL: API_ENDPOINT,
});

apiService.interceptors.request.use((config: AxiosRequestConfig<any>) => {
  if (config && config.headers && localStorage.auth) {
    const auth = JSON.parse(localStorage.auth);
    config.headers.Authorization = `Bearer ${auth.accessToken}`;
  }
  return config;
});

apiService.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error: AxiosError) {
    if (error.code === 'ERR_NETWORK') {
      store.dispatch(showSnackbar(error.message, 'error'));
      store.dispatch(errNetwork());
    } else if (store.getState().global.errNetwork) store.dispatch(errNetwork(false));

    console.log(error.response);
    if (error.response?.status === 401) {
      apiService.get('/auth/refresh-token', { withCredentials: true });
      // store.dispatch(logOut());
    }
    return Promise.reject(error);
  }
);

export { apiService };
