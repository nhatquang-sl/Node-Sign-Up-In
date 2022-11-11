import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { styled, useTheme } from '@mui/material/styles';
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
  MenuItem,
} from '@mui/material';
import Zoom from '@mui/material/Zoom';
import { sidebarWidth } from 'store/constants';

import { useAuth, useApiService } from 'hooks';
import { Props, mapStateToProps, mapDispatchToProps } from './types';
import { AuthState } from 'context/auth-provider';
import { TokenType } from 'shared/user';

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop: any) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${sidebarWidth}px)`,
    marginLeft: `${sidebarWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));
const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

function Header(props: Props) {
  const theme = useTheme();
  const navigate = useNavigate();
  const { auth, setAuth } = useAuth();
  const apiService = useApiService();
  const { openHeader, closeSidebarAndHeader } = props;

  const transitionDuration = {
    enter: theme.transitions.duration.enteringScreen,
    exit: theme.transitions.duration.leavingScreen,
  };
  const { accessToken } = auth;
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

  useEffect(() => {
    accessToken ? openHeader() : closeSidebarAndHeader();
  }, [accessToken, openHeader, closeSidebarAndHeader]);

  const handleDrawerOpen = () => {
    props.openSidebar();
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const logOut = async () => {
    props.loading(true);
    try {
      await apiService.get('/auth/log-out');
      setAuth(new AuthState());
    } catch (err) {}
    props.loading(false);
  };

  const handleCloseUserMenu = (setting: string | undefined) => {
    switch (setting?.toLocaleLowerCase()) {
      case 'logout':
        logOut();
        break;
      case 'profile':
        navigate('/profile');
        break;
    }
    setAnchorElUser(null);
  };
  return (
    <Slide in={props.settings.headerOpen}>
      <AppBar position="fixed" open={props.settings.sideBarOpen}>
        <Toolbar>
          {auth.type === TokenType.Login && (
            <Zoom
              in={!props.settings.sideBarOpen}
              timeout={transitionDuration}
              style={{
                transitionDelay: `${transitionDuration.exit}ms`,
              }}
            >
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={handleDrawerOpen}
                edge="start"
                sx={{ mr: 2, ...(props.settings.sideBarOpen && { display: 'none' }) }}
              >
                <Icon>menu</Icon>
              </IconButton>
            </Zoom>
          )}
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ cursor: 'pointer' }}
            onClick={() => navigate('/')}
          >
            Application
          </Typography>
          <Typography sx={{ flexGrow: 1 }} />
          <Box>
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
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
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
