import React from 'react';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import { Slide, Toolbar, Button, IconButton, Icon, Typography } from '@mui/material';

import { sidebarWidth } from 'store/constants';

import { Props, mapStateToProps, mapDispatchToProps } from './types';

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop: any) => prop !== 'open'
})<AppBarProps>(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen
  }),
  ...(open && {
    width: `calc(100% - ${sidebarWidth}px)`,
    marginLeft: `${sidebarWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    })
  })
}));

function Header(props: Props) {
  const navigate = useNavigate();
  const { accessToken, emailConfirmed } = props.auth;

  const handleDrawerOpen = () => {
    props.openSidebar();
  };
  const handleMenu = () => {};

  return (
    <Slide in={props.settings.headerOpen}>
      <AppBar position="fixed" open={props.settings.sideBarOpen}>
        <Toolbar>
          {emailConfirmed && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={{ mr: 2, ...(props.settings.sideBarOpen && { display: 'none' }) }}
            >
              <Icon>menu</Icon>
            </IconButton>
          )}
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Application
          </Typography>
          {accessToken ? (
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <Icon>account_circle</Icon>
            </IconButton>
          ) : (
            <Button onClick={() => navigate('/login')} color="inherit">
              Login
            </Button>
          )}
        </Toolbar>
      </AppBar>
    </Slide>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);
