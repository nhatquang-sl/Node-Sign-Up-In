import { bindActionCreators, Dispatch } from 'redux';
import { UserRegisterDto } from 'shared/user/dto';
// import { validateUserRegister } from '@libs/user';
import { register } from 'store/auth/actions';
import { SettingsState } from 'store/settings/types';
import { AuthState } from 'store/auth/types';

interface PropsFromDispatch {
  register: typeof register;
}

interface PropsFromState {
  settings: SettingsState;
  auth: AuthState;
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
  auth: store.auth,
});

export const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      register,
    },
    dispatch
  );
