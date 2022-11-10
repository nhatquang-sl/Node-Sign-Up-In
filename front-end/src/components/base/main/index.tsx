import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Routes, Route, useLocation } from 'react-router-dom';

import ConsecutiveSnackBars from 'components/consecutive-snackbars';
import Loading from 'components/loading';

import { DrawerHeader, Container } from './styles';
import { Props, mapStateToProps, mapDispatchToProps } from './types';

import useRefreshToken from 'hooks/use-refresh-token';

import Dashboard from 'pages/dashboard';
import Binance from 'pages/bnb';
import Register from 'pages/auth/register';
import Login from 'pages/auth/login';
import Profile from 'pages/auth/profile';
import RequestActivateEmail from 'pages/auth/request-activate-email';
import RegisterConfirm from 'pages/auth/register-confirm';
import Unauthorized from 'pages/auth/unauthorized';
import { ForgotPassword, ResetPassword } from 'pages/auth/password';
import RequireAuth from './require-auth';

function Main(props: Props) {
  console.log('main');
  const location = useLocation();
  const { refresh } = useRefreshToken();
  const [init, setInit] = useState(true);
  const { loading } = props;

  useEffect(() => {
    loading(true);
    const refreshToken = async () => {
      if (!location.pathname.includes('register-confirm')) await refresh();

      loading(false);
      setInit(false);
    };

    refreshToken();
  }, []);

  return init ? (
    <Loading />
  ) : (
    <Container open={props.settings.sideBarOpen}>
      {props.settings.headerOpen && <DrawerHeader />}
      <Routes>
        <Route element={<RequireAuth />}>
          <Route path="/request-activate-email" element={<RequestActivateEmail />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/" element={<Dashboard />} />
        </Route>
        <Route element={<RequireAuth allowedRoles={['admin']} />}>
          <Route path="/bnb" element={<Binance />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/register-confirm/:activationCode" element={<RegisterConfirm />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
      </Routes>
      <ConsecutiveSnackBars />
      <Loading />
    </Container>
  );
}
export default connect(mapStateToProps, mapDispatchToProps)(Main);
