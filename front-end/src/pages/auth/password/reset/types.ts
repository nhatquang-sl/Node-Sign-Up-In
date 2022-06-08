import { loading } from 'store/settings/actions';
import { bindActionCreators, Dispatch } from 'redux';
import { setNewPassword } from 'store/auth/actions';
import { SettingsState } from 'store/settings/types';
import { AuthState } from 'store/auth/types';

interface PropsFromDispatch {
  setNewPassword: typeof setNewPassword;
}

interface PropsFromState {
  settings: SettingsState;
  auth: AuthState;
}

export interface Props extends PropsFromDispatch, PropsFromState {}

export class State {
  password: string = '';
  passwordError: string[] = [];
  showPassword: boolean = false;
  submitted: boolean = false;
  loading: boolean = false;
}

export const mapStateToProps = (store: any) => ({
  settings: store.settings,
  auth: store.auth,
});

export const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      setNewPassword,
    },
    dispatch
  );
