import React from 'react';
import { connect } from 'react-redux';
import { Switch, Route } from 'react-router-dom';

import ConsecutiveSnackBars from 'components/consecutive-snackbars';

import { DrawerHeader, Container } from './styles';
import { Props, mapStateToProps, mapDispatchToProps } from './types';

import SignIn from 'pages/auth/sign-in';
import SignUp from 'pages/auth/sign-up';

function Main(props: Props) {
  return (
    <Container open={props.settings.sideBarOpen}>
      {props.settings.headerOpen && <DrawerHeader />}
      <Switch>
        <Route exact path="/login" component={SignIn} />
        <Route exact path="/sign-up" component={SignUp} />
      </Switch>
      <ConsecutiveSnackBars />
    </Container>
  );
}
export default connect(mapStateToProps, mapDispatchToProps)(Main);
