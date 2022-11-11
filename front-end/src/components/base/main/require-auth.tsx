import { useLocation, Navigate, Outlet } from 'react-router-dom';
import useAuth from 'hooks/use-auth';
import { TokenType } from 'shared/user';

class Props {
  allowedRoles?: string[] = [];
}

const RequireAuth = (props: Props) => {
  const { auth } = useAuth();
  const location = useLocation();
  const isAuth = auth.id > 0;
  const { allowedRoles } = props;
  const author = !allowedRoles?.length || !!auth.roles.find((r) => props.allowedRoles?.includes(r));
  const needActivatePath = '/request-activate-email';
  const needActivate =
    !allowedRoles &&
    auth.type === TokenType.NeedActivate &&
    !location.pathname.includes(needActivatePath) &&
    !location.pathname.includes('register-confirm');
  // console.log({
  //   allowedRoles,
  //   auth,
  //   needActivate,
  //   type: auth.type,
  //   pathname: location.pathname,
  //   needActivatePath,
  // });

  return isAuth ? (
    needActivate ? (
      <Navigate to={needActivatePath} replace={true} />
    ) : author ? (
      <Outlet />
    ) : (
      <Navigate to="/unauthorized" state={{ from: location }} replace={true} />
    )
  ) : (
    <Navigate to="/login" state={{ from: location }} replace={true} />
  );
};

export default RequireAuth;
