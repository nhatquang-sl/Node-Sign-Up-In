import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
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

import { TokenType } from 'shared/user';
import { setHeader, setLoading, setSidebar, setSidebarAndHeader } from 'store/settings-slice';
import { RootState } from 'store';
import { useLogOutMutation } from 'store/auth-api';

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

function Header() {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    accessToken,
    firstName,
    lastName,
    type: authType,
  } = useSelector((state: RootState) => state.auth);
  const { sideBarOpen, headerOpen } = useSelector((state: RootState) => state.settings);
  const [logOut] = useLogOutMutation();

  const transitionDuration = {
    enter: theme.transitions.duration.enteringScreen,
    exit: theme.transitions.duration.leavingScreen,
  };
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

  useEffect(() => {
    accessToken ? dispatch(setHeader(true)) : dispatch(setSidebarAndHeader(false));
  }, [accessToken, dispatch]);

  const handleDrawerOpen = () => {
    dispatch(setSidebar(true));
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleLogOut = async () => {
    dispatch(setLoading(true));
    try {
      await logOut();
      localStorage.clear();
    } catch (err) {}
    window.location.reload();
    dispatch(setLoading(false));
  };

  const handleCloseUserMenu = (setting: string | undefined) => {
    switch (setting?.toLocaleLowerCase()) {
      case 'logout':
        handleLogOut();
        break;
      case 'profile':
        navigate('/profile');
        break;
    }
    setAnchorElUser(null);
  };
  return (
    <Slide in={headerOpen}>
      <AppBar position="fixed" open={sideBarOpen}>
        <Toolbar>
          {authType === TokenType.Login && (
            <Zoom
              in={!sideBarOpen}
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
                sx={{ mr: 2, ...(sideBarOpen && { display: 'none' }) }}
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
          <Typography>
            {firstName} {lastName}
          </Typography>
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

export default Header;
