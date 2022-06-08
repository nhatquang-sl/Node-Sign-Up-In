import { bindActionCreators, Dispatch } from 'redux';
import { getSendEmailResetPassword } from 'store/auth/actions';
import { SettingsState } from 'store/settings/types';
import { AuthState } from 'store/auth/types';

interface PropsFromDispatch {
  getSendEmailResetPassword: typeof getSendEmailResetPassword;
}

interface PropsFromState {
  settings: SettingsState;
  auth: AuthState;
}

export interface Props extends PropsFromDispatch, PropsFromState {}

export class State {
  constructor(emailAddress: string = '') {
    emailAddress = emailAddress;
  }
  emailAddress: string = '';
  emailAddressError: string | undefined = undefined;
  submitted: boolean = false;
}

export const mapStateToProps = (store: any) => ({
  settings: store.settings,
  auth: store.auth,
});

export const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      getSendEmailResetPassword,
    },
    dispatch
  );
