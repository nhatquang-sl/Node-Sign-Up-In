import { bindActionCreators, Dispatch } from 'redux';
import { openHeader } from 'store/settings/actions';
import { showSnackbar } from 'store/snackbar/actions';
import { SettingsState } from 'store/settings/types';
import { AuthState } from 'store/auth/types';

interface PropsFromDispatch {
  openHeader: typeof openHeader;
  showSnackbar: typeof showSnackbar;
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
      openHeader,
      showSnackbar
    },
    dispatch
  );
