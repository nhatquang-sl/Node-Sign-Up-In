import React from 'react';
import { connect } from 'react-redux';
import { Routes, Route } from 'react-router-dom';

import ConsecutiveSnackBars from 'components/consecutive-snackbars';
import Loading from 'components/loading';

import { DrawerHeader, Container } from './styles';
import { Props, mapStateToProps, mapDispatchToProps } from './types';

import Dashboard from 'pages/dashboard';
import Register from 'pages/auth/register';
import Login from 'pages/auth/login';
import Profile from 'pages/auth/profile';
import RequestActivateEmail from 'pages/auth/request-activate-email';
import RegisterConfirm from 'pages/auth/register-confirm';
import { ForgotPassword, ResetPassword } from 'pages/auth/password';

function Main(props: Props) {
  return (
    <Container open={props.settings.sideBarOpen}>
      {props.settings.headerOpen && <DrawerHeader />}
      <Routes>
        <Route path="/register-confirm/:activationCode" element={<RegisterConfirm />} />
        <Route path="/request-activate-email" element={<RequestActivateEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/" element={<Dashboard />} />
      </Routes>
      <ConsecutiveSnackBars />
      <Loading />
    </Container>
  );
}
export default connect(mapStateToProps, mapDispatchToProps)(Main);
