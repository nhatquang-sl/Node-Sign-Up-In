import { SETTINGS } from './types';

const openSidebar = () => ({
  type: SETTINGS.OPEN_SIDEBAR,
});

const closeSidebar = () => ({
  type: SETTINGS.CLOSE_SIDEBAR,
});

const openHeader = () => ({
  type: SETTINGS.OPEN_HEADER,
});

const openSidebarAndHeader = () => ({
  type: SETTINGS.OPEN_SIDEBAR_AND_HEADER,
});

const closeSidebarAndHeader = () => ({
  type: SETTINGS.CLOSE_SIDEBAR_AND_HEADER,
});

const loading = (isLoading: boolean = true) => ({
  type: isLoading ? SETTINGS.OPEN_LOADING : SETTINGS.CLOSE_LOADING,
});

export {
  openSidebar,
  closeSidebar,
  openHeader,
  openSidebarAndHeader,
  closeSidebarAndHeader,
  loading,
};
