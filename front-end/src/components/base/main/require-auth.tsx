import { useLocation, Navigate, Outlet } from 'react-router-dom';
import useAuth from 'hooks/use-auth';

class Props {
  allowedRoles?: string[] = [];
}

const RequireAuth = (props: Props) => {
  const { auth } = useAuth();
  const { allowedRoles } = props;
  const location = useLocation();
  const isAuth = auth.id > 0;
  const author = !allowedRoles?.length || !!auth.roles.find((r) => props.allowedRoles?.includes(r));

  return isAuth ? (
    author ? (
      <Outlet />
    ) : (
      <Navigate to="/unauthorized" state={{ from: location }} replace={true} />
    )
  ) : (
    <Navigate to="/login" state={{ from: location }} replace={true} />
  );
};

export default RequireAuth;
