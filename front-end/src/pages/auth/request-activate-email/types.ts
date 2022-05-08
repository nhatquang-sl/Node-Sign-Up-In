import { bindActionCreators, Dispatch } from 'redux';
import { sendActivateLink } from 'store/auth/actions';
import { AuthState } from 'store/auth/types';

interface PropsFromDispatch {
  sendActivateLink: typeof sendActivateLink;
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
      sendActivateLink,
    },
    dispatch
  );
