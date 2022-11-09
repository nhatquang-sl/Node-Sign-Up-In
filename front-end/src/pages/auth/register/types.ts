import { bindActionCreators, Dispatch } from 'redux';
import { UserRegisterDto } from 'shared/user/dto';
import { SettingsState } from 'store/settings/types';

interface PropsFromDispatch {}

interface PropsFromState {
  settings: SettingsState;
}

export interface Props extends PropsFromDispatch, PropsFromState {}

export interface State extends UserRegisterDto {
  firstNameError: string | undefined;
  lastNameError: string | undefined;
  emailAddressError: string | undefined;
  passwordError: string[];
  showPassword: boolean;
  submitted: boolean;
}

export const mapStateToProps = (store: any) => ({
  settings: store.settings,
});

export const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({}, dispatch);
