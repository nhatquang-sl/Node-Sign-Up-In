import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { styled, useTheme } from '@mui/material/styles';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Icon from '@mui/material/Icon';
import Zoom from '@mui/material/Zoom';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import { sidebarWidth } from 'store/constants';

import { Props, mapStateToProps, mapDispatchToProps } from './types';

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

function Sidebar(props: Props) {
  const theme = useTheme();

  const transitionDuration = {
    enter: theme.transitions.duration.enteringScreen,
    exit: theme.transitions.duration.leavingScreen,
  };

  const handleDrawerClose = () => {
    props.closeSidebar();
  };

  return (
    <Drawer
      sx={{
        width: sidebarWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: sidebarWidth,
          boxSizing: 'border-box',
        },
      }}
      variant="persistent"
      anchor="left"
      open={props.settings.sideBarOpen}
    >
      <DrawerHeader>
        <Zoom
          in={props.settings.sideBarOpen}
          timeout={transitionDuration}
          style={{
            transitionDelay: `${transitionDuration.exit}ms`,
          }}
        >
          <IconButton onClick={handleDrawerClose}>
            <Icon>{theme.direction === 'ltr' ? 'chevron_left' : 'chevron_right'}</Icon>
          </IconButton>
        </Zoom>
      </DrawerHeader>
      <Divider />
      <Divider />
      <List>
        {['Binance'].map((text, index) => (
          <ListItem key={text} disablePadding button component={Link} to={'/bnb'}>
            <ListItemButton>
              <ListItemIcon>
                <Icon>currency_bitcoin</Icon>
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);
