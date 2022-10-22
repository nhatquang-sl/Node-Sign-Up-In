import { USER_TYPE } from './types';

import { apiService } from '../services';

const getUserSessions = () => ({
  type: USER_TYPE.GET_USER_SESSIONS,
  payload: apiService.get(`user/sessions`),
});

export { getUserSessions };
