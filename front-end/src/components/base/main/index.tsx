import React from 'react';
import { connect } from 'react-redux';
import { Routes, Route } from 'react-router-dom';

import ConsecutiveSnackBars from 'components/consecutive-snackbars';

import { DrawerHeader, Container } from './styles';
import { Props, mapStateToProps, mapDispatchToProps } from './types';

// import SignIn from 'pages/auth/sign-in';
// import SignUp from 'pages/auth/sign-up';
// import RequestActivateEmail from 'pages/auth/request-activate-email';
import Dashboard from 'pages/dashboard';

function Main(props: Props) {
  return (
    <Container open={props.settings.sideBarOpen}>
      {props.settings.headerOpen && <DrawerHeader />}
      <Routes>
        {/* <Route path="/login" element={<SignIn />} />
        <Route path="/register" element={<SignUp />} />
        <Route path="/request-activate-email" element={<RequestActivateEmail />} /> */}
        <Route path="/" element={<Dashboard />} />
      </Routes>
      <ConsecutiveSnackBars />
    </Container>
  );
}
export default connect(mapStateToProps, mapDispatchToProps)(Main);
