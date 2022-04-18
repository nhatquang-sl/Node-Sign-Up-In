import { bindActionCreators, Dispatch } from 'redux';
import { closeSidebarAndHeader } from 'store/settings/actions';
import { SettingsState } from 'store/settings/types';
import { AuthState } from 'store/auth/types';

interface PropsFromDispatch {
  closeSidebarAndHeader: typeof closeSidebarAndHeader;
}

interface PropsFromState {
  settings: SettingsState;
  auth: AuthState;
}

export interface Props extends PropsFromDispatch, PropsFromState {}

export const mapStateToProps = (store: any) => ({
  settings: store.settings,
  auth: store.auth
});

export const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      closeSidebarAndHeader
    },
    dispatch
  );
