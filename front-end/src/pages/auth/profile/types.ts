import { bindActionCreators, Dispatch } from 'redux';
import { UserRegisterDto } from 'shared/user/dto';

interface PropsFromDispatch {}

interface PropsFromState {}

export interface State extends UserRegisterDto {
  firstNameError: string | undefined;
  lastNameError: string | undefined;
  emailAddressError: string | undefined;
  submitted: boolean;
}

export interface Props extends PropsFromDispatch, PropsFromState {}

export const mapStateToProps = () => ({});

export const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({}, dispatch);
