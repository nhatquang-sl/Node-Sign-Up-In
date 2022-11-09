import { AUTH_TYPE } from './types';

import { apiService } from '../services';

const getLastDateResetPassword = (emailAddress: string) => ({
  type: AUTH_TYPE.GET_RESET_PASSWORD_LAST_DATE,
  payload: apiService.post(`auth/reset-password/last-date`, { emailAddress }),
});

const getSendEmailResetPassword = (emailAddress: string) => ({
  type: AUTH_TYPE.SEND_EMAIL_RESET_PASSWORD,
  payload: apiService.post(`auth/reset-password/send-email`, { emailAddress }),
});

const setNewPassword = (token: string, password: string) => ({
  type: AUTH_TYPE.SET_NEW_PASSWORD,
  payload: apiService.post(`auth/reset-password/set-new`, { token, password }),
});

export { getLastDateResetPassword, getSendEmailResetPassword, setNewPassword };
