import { UserLoginDto, UserRegisterDto, UserAuthDto } from 'shared/user/dto';
import { AUTH_TYPE } from './types';

import { apiService } from '../services';

const login = (request: UserLoginDto) => ({
  type: AUTH_TYPE.LOGIN,
  payload: apiService.post(`auth/login`, request),
});

const register = (request: UserRegisterDto) => ({
  type: AUTH_TYPE.REGISTER,
  payload: apiService.post(`auth/register`, request),
});

const registerConfirm = (activationCode: string) => ({
  type: AUTH_TYPE.REGISTER_CONFIRM,
  payload: apiService.get(`auth/activate/${activationCode}`),
});

const logOut = () => ({
  type: AUTH_TYPE.LOG_OUT,
});

const updateAuth = (userAuth: UserAuthDto) => ({
  type: AUTH_TYPE.UPDATE,
  payload: userAuth,
});

const sendActivateLink = () => ({
  type: AUTH_TYPE.SEND_ACTIVATE_LINK,
  payload: apiService.post(`auth/send-activation-email`),
});

const getProfile = () => ({
  type: AUTH_TYPE.GET_USER_PROFILE,
  payload: apiService.get(`auth/profile`),
});

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

export {
  login,
  register,
  registerConfirm,
  logOut,
  updateAuth,
  sendActivateLink,
  getProfile,
  getLastDateResetPassword,
  getSendEmailResetPassword,
  setNewPassword,
};
