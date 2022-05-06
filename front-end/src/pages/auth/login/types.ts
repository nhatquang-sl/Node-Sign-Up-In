import { bindActionCreators, Dispatch } from 'redux';
import { UserLoginDto } from 'shared/user/dto';
import { showSnackbar } from 'store/snackbar/actions';
import { login } from 'store/auth/actions';
import { SettingsState } from 'store/settings/types';
import { AuthState } from 'store/auth/types';

interface PropsFromDispatch {
  showSnackbar: typeof showSnackbar;
  login: typeof login;
}

interface PropsFromState {
  settings: SettingsState;
  auth: AuthState;
}

export interface State extends UserLoginDto {
  emailAddressError: string | undefined;
  passwordError: string | undefined;
  showPassword: boolean;
}

export interface Props extends PropsFromDispatch, PropsFromState {}

export const mapStateToProps = (store: any) => ({
  settings: store.settings,
  auth: store.auth,
});

export const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      showSnackbar,
      login,
    },
    dispatch
  );
