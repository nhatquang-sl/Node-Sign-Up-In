import { bindActionCreators, Dispatch } from 'redux';
import { showSnackbar } from 'store/snackbar/actions';
import { getKlines } from 'store/bnb/actions';
import { SettingsState } from 'store/settings/types';
import { AuthState } from 'store/auth/types';
import { BnbState } from 'store/bnb/types';

interface PropsFromDispatch {
  showSnackbar: typeof showSnackbar;
  getKlines: typeof getKlines;
}

interface PropsFromState {
  settings: SettingsState;
  auth: AuthState;
  bnb: BnbState;
}

export interface Props extends PropsFromDispatch, PropsFromState {}

export const mapStateToProps = (store: any) => ({
  settings: store.settings,
  auth: store.auth,
  bnb: store.bnb,
});

export const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      showSnackbar,
      getKlines,
    },
    dispatch
  );
