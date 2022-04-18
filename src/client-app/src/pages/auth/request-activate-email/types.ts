import { bindActionCreators, Dispatch } from 'redux';
import { openHeader } from 'store/settings/actions';
import { AuthState } from 'store/auth/types';

interface PropsFromDispatch {
  openHeader: typeof openHeader;
}

interface PropsFromState {
  auth: AuthState;
}

export interface Props extends PropsFromDispatch, PropsFromState {}

export const mapStateToProps = (store: any) => ({
  auth: store.auth
});

export const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      openHeader
    },
    dispatch
  );
