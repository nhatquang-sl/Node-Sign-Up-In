import { useLocation, Navigate, Outlet } from 'react-router-dom';
import useAuth from 'hooks/use-auth';

const RequireAuth = () => {
  const { auth } = useAuth();
  const location = useLocation();

  return auth.id > 0 ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace={true} />
  );
};

export default RequireAuth;
