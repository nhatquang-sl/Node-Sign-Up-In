import axios from 'axios';
import { AUTH_TYPE, User } from './types';

import { API_ENDPOINT } from '../constants';

const signIn = () => ({
  type: AUTH_TYPE.SIGN_IN,
  payload: axios.get(`${API_ENDPOINT}//auth/login`)
});

const signUp = (request: User) => ({
  type: AUTH_TYPE.SIGN_UP,
  payload: axios.post(`${API_ENDPOINT}/auth/register`, request)
});

export { signIn, signUp };
