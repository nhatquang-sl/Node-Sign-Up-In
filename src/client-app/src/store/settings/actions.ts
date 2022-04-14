import { SETTINGS } from './types';

const openSidebarAndHeader = () => ({
  type: SETTINGS.OPEN_SIDEBAR_AND_HEADER
});

const closeSidebarAndHeader = () => ({
  type: SETTINGS.CLOSE_SIDEBAR_AND_HEADER
});

export { openSidebarAndHeader, closeSidebarAndHeader };
