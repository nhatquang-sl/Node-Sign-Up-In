import { bindActionCreators, Dispatch } from 'redux';
import { openSidebar, closeSidebarAndHeader } from 'store/settings/actions';
import { logOut } from 'store/auth/actions';
import { SettingsState } from 'store/settings/types';
import { AuthState } from 'store/auth/types';

interface PropsFromDispatch {
  openSidebar: typeof openSidebar;
  closeSidebarAndHeader: typeof closeSidebarAndHeader;
  logOut: typeof logOut;
}

interface PropsFromState {
  settings: SettingsState;
  auth: AuthState;
}

export interface Props extends PropsFromDispatch, PropsFromState {}

export const mapStateToProps = (store: any) => ({
  settings: store.settings,
  auth: store.auth,
});

export const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      openSidebar,
      closeSidebarAndHeader,
      logOut,
    },
    dispatch
  );
