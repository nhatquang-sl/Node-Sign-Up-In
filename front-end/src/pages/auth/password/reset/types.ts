import { bindActionCreators, Dispatch } from 'redux';
import { setNewPassword } from 'store/auth/actions';
import { SettingsState } from 'store/settings/types';
import { AuthState } from 'store/auth/types';
import { GlobalState } from 'store/global/types';

interface PropsFromDispatch {
  setNewPassword: typeof setNewPassword;
}

interface PropsFromState {
  settings: SettingsState;
  auth: AuthState;
  global: GlobalState;
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
  global: store.global,
});

export const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      setNewPassword,
    },
    dispatch
  );
