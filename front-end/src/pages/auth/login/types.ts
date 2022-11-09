import { bindActionCreators, Dispatch } from 'redux';
import { UserLoginDto } from 'shared/user/dto';
import { showSnackbar } from 'store/snackbar/actions';

interface PropsFromDispatch {
  showSnackbar: typeof showSnackbar;
}

interface PropsFromState {}

export interface State extends UserLoginDto {
  emailAddressError: string | undefined;
  passwordError: string | undefined;
  showPassword: boolean;
}

export interface Props extends PropsFromDispatch, PropsFromState {}

export const mapStateToProps = () => ({});

export const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      showSnackbar,
    },
    dispatch
  );
