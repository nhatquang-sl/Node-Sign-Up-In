import axios from 'axios';
import { UserRegisterDto, UserAuthDto } from 'shared/user/dto';
import { AUTH_TYPE } from './types';

import { API_ENDPOINT } from '../constants';

const signIn = () => ({
  type: AUTH_TYPE.SIGN_IN,
  payload: axios.get(`${API_ENDPOINT}//auth/login`),
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
export { signIn, register, logOut, updateAuth };
