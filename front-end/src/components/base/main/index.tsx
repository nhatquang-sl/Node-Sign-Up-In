import React from 'react';
import { connect } from 'react-redux';
import { Routes, Route } from 'react-router-dom';

import ConsecutiveSnackBars from 'components/consecutive-snackbars';

import { DrawerHeader, Container } from './styles';
import { Props, mapStateToProps, mapDispatchToProps } from './types';

import Register from 'pages/auth/register';
import Login from 'pages/auth/login';
// import RequestActivateEmail from 'pages/auth/request-activate-email';
import Dashboard from 'pages/dashboard';
import RequestActivateEmail from 'pages/auth/request-activate-email';
import RegisterConfirm from 'pages/auth/register-confirm';

function Main(props: Props) {
  return (
    <Container open={props.settings.sideBarOpen}>
      {props.settings.headerOpen && <DrawerHeader />}
      <Routes>
        {/*  />
        <Route path="/register" element={<SignUp />} />
        <Route path="/request-activate-email" element={<RequestActivateEmail />} /> */}

        <Route path="/register-confirm/:activateCode" element={<RegisterConfirm />} />
        <Route path="/request-activate-email" element={<RequestActivateEmail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Dashboard />} />
      </Routes>
      <ConsecutiveSnackBars />
    </Container>
  );
}
export default connect(mapStateToProps, mapDispatchToProps)(Main);
