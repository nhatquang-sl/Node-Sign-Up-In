import { bindActionCreators, Dispatch } from 'redux';
import { showSnackbar } from 'store/snackbar/actions';

interface PropsFromDispatch {
  showSnackbar: typeof showSnackbar;
}

interface PropsFromState {}

export interface Props extends PropsFromDispatch, PropsFromState {}

export const mapStateToProps = () => ({});

export const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators({ showSnackbar }, dispatch);
