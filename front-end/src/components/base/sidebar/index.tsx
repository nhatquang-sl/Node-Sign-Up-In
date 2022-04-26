import React from 'react';
import { connect } from 'react-redux';
import { styled, useTheme } from '@mui/material/styles';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Icon from '@mui/material/Icon';

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
        <IconButton onClick={handleDrawerClose}>
          <Icon>{theme.direction === 'ltr' ? 'chevron_left' : 'chevron_right'}</Icon>
        </IconButton>
      </DrawerHeader>
      <Divider />
    </Drawer>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);
