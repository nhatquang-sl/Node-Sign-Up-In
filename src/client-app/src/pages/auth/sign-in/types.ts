import { bindActionCreators, Dispatch } from 'redux';
import { closeSidebarAndHeader } from 'store/settings/actions';
import { showSnackbar } from 'store/snackbar/actions';
import { updateAuth } from 'store/auth/actions';
import { SettingsState } from 'store/settings/types';
import { AuthState } from 'store/auth/types';

interface PropsFromDispatch {
  closeSidebarAndHeader: typeof closeSidebarAndHeader;
  showSnackbar: typeof showSnackbar;
  updateAuth: typeof updateAuth;
}

interface PropsFromState {
  settings: SettingsState;
  auth: AuthState;
}

export interface State {
  emailAddress: string;
  emailAddressError: string | undefined;
  password: string;
  passwordError: string | undefined;
  showPassword: boolean;
}

export interface Props extends PropsFromDispatch, PropsFromState {}

export const mapStateToProps = (store: any) => ({
  settings: store.settings,
  auth: store.auth
});

export const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      closeSidebarAndHeader,
      showSnackbar,
      updateAuth
    },
    dispatch
  );
