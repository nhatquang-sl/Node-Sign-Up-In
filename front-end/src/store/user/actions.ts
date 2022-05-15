import axios from 'axios';
import { USER_TYPE } from './types';

import { API_ENDPOINT } from '../constants';

const getUserSessions = () => ({
  type: USER_TYPE.GET_USER_SESSIONS,
  payload: axios.get(`${API_ENDPOINT}/user/sessions`),
});

export { getUserSessions };
