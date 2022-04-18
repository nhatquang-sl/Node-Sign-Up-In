import React from 'react';
import { connect } from 'react-redux';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { createBrowserHistory } from 'history';

import ConsecutiveSnackBars from 'components/consecutive-snackbars';

import { DrawerHeader, Container } from './styles';
import { Props, mapStateToProps, mapDispatchToProps } from './types';

import SignIn from 'pages/auth/sign-in';
import SignUp from 'pages/auth/sign-up';
import RequestConfirmEmail from 'pages/auth/request-confirm-email';

const history = createBrowserHistory();
function Main(props: Props) {
  return (
    <Container open={props.settings.sideBarOpen}>
      {props.settings.headerOpen && <DrawerHeader />}
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/request-confirm-email" element={<RequestConfirmEmail />} />
        </Routes>
      </BrowserRouter>
      <ConsecutiveSnackBars />
    </Container>
  );
}
export default connect(mapStateToProps, mapDispatchToProps)(Main);
