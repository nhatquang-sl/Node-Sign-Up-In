import { bindActionCreators, Dispatch } from 'redux';
import { showSnackbar, cleanUpSnackbar } from 'store/snackbar/actions';
import { SnackbarState } from 'store/snackbar/types';

interface PropsFromDispatch {
  showSnackbar: typeof showSnackbar;
  cleanUpSnackbar: typeof cleanUpSnackbar;
}

interface PropsFromState {
  snackbar: SnackbarState;
}

export interface Props extends PropsFromDispatch, PropsFromState {}

export const mapStateToProps = (store: any) => ({
  snackbar: store.snackbar,
});

export const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      showSnackbar,
      cleanUpSnackbar,
    },
    dispatch
  );
