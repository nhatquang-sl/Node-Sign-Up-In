import React from 'react';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import {
  Slide,
  Toolbar,
  Button,
  IconButton,
  Icon,
  Typography,
  Box,
  Tooltip,
  Menu,
  MenuItem
} from '@mui/material';

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
const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];
function Header(props: Props) {
  const navigate = useNavigate();
  const { accessToken, emailConfirmed } = props.auth;
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
  const handleDrawerOpen = () => {
    props.openSidebar();
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseUserMenu = (setting: string | undefined) => {
    switch (setting?.toLocaleLowerCase()) {
      case 'logout':
        props.logOut();
        break;
    }
    setAnchorElUser(null);
  };
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
          <Box sx={{ flexGrow: 0 }}>
            {accessToken ? (
              <Tooltip title="Open settings">
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleOpenUserMenu}
                  color="inherit"
                >
                  <Icon>account_circle</Icon>
                </IconButton>
              </Tooltip>
            ) : (
              <Button onClick={() => navigate('/login')} color="inherit">
                Login
              </Button>
            )}
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right'
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right'
              }}
              open={Boolean(anchorElUser)}
              onClose={() => handleCloseUserMenu(undefined)}
            >
              {settings.map((setting) => (
                <MenuItem key={setting} onClick={() => handleCloseUserMenu(setting)}>
                  <Typography textAlign="center">{setting}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
    </Slide>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);
