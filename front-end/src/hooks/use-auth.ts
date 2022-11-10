import { useContext } from 'react';
import AuthContext from 'context/auth-provider';

export const useAuth = () => {
  return useContext(AuthContext);
};

export default useAuth;
