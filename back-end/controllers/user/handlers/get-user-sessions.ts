import UserLoginHistory from '@database/models/user-login-history';

const handleGetUserSessions = async () => {
  return await UserLoginHistory.findAll();
};

export default handleGetUserSessions;
