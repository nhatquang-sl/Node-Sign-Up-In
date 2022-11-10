import { bindActionCreators, Dispatch } from 'redux';
import { showSnackbar } from 'store/snackbar/actions';

interface PropsFromDispatch {
  showSnackbar: typeof showSnackbar;
}

interface PropsFromState {}

export interface Props extends PropsFromDispatch, PropsFromState {}

export class State {
  password: string = '';
  passwordError: string[] = [];
  showPassword: boolean = false;
  submitted: boolean = false;
  submitting: boolean = false;
}

export const mapStateToProps = (store: any) => ({});

export const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators({ showSnackbar }, dispatch);
