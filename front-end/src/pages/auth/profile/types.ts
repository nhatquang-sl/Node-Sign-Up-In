import { bindActionCreators, Dispatch } from 'redux';
import { UserRegisterDto } from 'shared/user/dto';
import { SettingsState } from 'store/settings/types';
import { AuthState } from 'store/auth/types';

interface PropsFromDispatch {}

interface PropsFromState {
  settings: SettingsState;
  auth: AuthState;
}

export interface State extends UserRegisterDto {
  firstNameError: string | undefined;
  lastNameError: string | undefined;
  emailAddressError: string | undefined;
  submitted: boolean;
}

export interface Props extends PropsFromDispatch, PropsFromState {}

export const mapStateToProps = (store: any) => ({
  settings: store.settings,
  auth: store.auth,
});

export const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({}, dispatch);
