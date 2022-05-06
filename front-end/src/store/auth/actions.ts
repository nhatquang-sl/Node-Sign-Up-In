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

const logOut = () => ({
  type: AUTH_TYPE.LOG_OUT,
});

const updateAuth = (userAuth: UserAuthDto) => ({
  type: AUTH_TYPE.UPDATE,
  payload: userAuth,
});
export { login, register, logOut, updateAuth };
