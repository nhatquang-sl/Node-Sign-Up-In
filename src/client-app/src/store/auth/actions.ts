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

const logOut = () => ({
  type: AUTH_TYPE.LOG_OUT
});

const updateAuth = (
  id: number,
  accessToken: string,
  firstName: string,
  lastName: string,
  emailAddress: string,
  emailConfirmed: boolean
) => ({
  type: AUTH_TYPE.UPDATE,
  payload: {
    id,
    accessToken,
    firstName,
    lastName,
    emailAddress,
    emailConfirmed
  }
});
export { signIn, signUp, logOut, updateAuth };
