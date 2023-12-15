import { useSelector, useDispatch } from 'react-redux';
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
import { setSidebar } from 'store/settings-slice';
import { RootState } from 'store';

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

function Sidebar() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const sideBarOpen = useSelector((state: RootState) => state.settings.sideBarOpen);
  const transitionDuration = {
    enter: theme.transitions.duration.enteringScreen,
    exit: theme.transitions.duration.leavingScreen,
  };

  const handleDrawerClose = () => {
    dispatch(setSidebar(false));
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
      open={sideBarOpen}
    >
      <DrawerHeader>
        <Zoom
          in={sideBarOpen}
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
        {[
          { text: 'Binance', path: 'bnb' },
          { text: 'Plans', path: 'plans' },
        ].map((item) => (
          <ListItem
            key={item.path}
            disablePadding
            button
            component={Link}
            to={`/${item.path}`}
            onClick={handleDrawerClose}
          >
            <ListItemButton>
              <ListItemIcon>
                <Icon>currency_bitcoin</Icon>
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}

export default Sidebar;
