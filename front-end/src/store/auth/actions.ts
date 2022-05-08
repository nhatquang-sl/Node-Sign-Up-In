import axios from 'axios';
import { UserLoginDto, UserRegisterDto, UserAuthDto } from 'shared/user/dto';
import { AUTH_TYPE } from './types';

import { API_ENDPOINT } from '../constants';

const login = (request: UserLoginDto) => ({
  type: AUTH_TYPE.LOGIN,
  payload: axios.post(`${API_ENDPOINT}/auth/login`, request),
});

const register = (request: UserRegisterDto) => ({
  type: AUTH_TYPE.REGISTER,
  payload: axios.post(`${API_ENDPOINT}/auth/register`, request),
});

const registerConfirm = (activateCode: string) => ({
  type: AUTH_TYPE.REGISTER_CONFIRM,
  payload: axios.get(`${API_ENDPOINT}/auth/register-confirm/${activateCode}`),
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
  payload: axios.post(`${API_ENDPOINT}/auth/send-activate-link`),
});
export { login, register, registerConfirm, logOut, updateAuth, sendActivateLink };
