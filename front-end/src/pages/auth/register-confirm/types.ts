import { bindActionCreators, Dispatch } from 'redux';
import { registerConfirm } from 'store/auth/actions';
import { AuthState } from 'store/auth/types';

interface PropsFromDispatch {
  registerConfirm: typeof registerConfirm;
}

interface PropsFromState {
  auth: AuthState;
}

export interface Props extends PropsFromDispatch, PropsFromState {}

export const mapStateToProps = (store: any) => ({
  auth: store.auth,
});

export const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      registerConfirm,
    },
    dispatch
  );
