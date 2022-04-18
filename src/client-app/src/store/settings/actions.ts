import { SETTINGS } from './types';

const openSidebar = () => ({
  type: SETTINGS.OPEN_SIDEBAR
});

const closeSidebar = () => ({
  type: SETTINGS.CLOSE_SIDEBAR
});
const openSidebarAndHeader = () => ({
  type: SETTINGS.OPEN_SIDEBAR_AND_HEADER
});

const closeSidebarAndHeader = () => ({
  type: SETTINGS.CLOSE_SIDEBAR_AND_HEADER
});

export { openSidebar, closeSidebar, openSidebarAndHeader, closeSidebarAndHeader };
