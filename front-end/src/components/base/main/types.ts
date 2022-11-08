import { bindActionCreators, Dispatch } from 'redux';
import { openSidebarAndHeader, loading } from 'store/settings/actions';

import { SettingsState } from 'store/settings/types';

interface PropsFromDispatch {
  openSidebarAndHeader: typeof openSidebarAndHeader;
  loading: typeof loading;
}

interface PropsFromState {
  settings: SettingsState;
}

export interface Props extends PropsFromDispatch, PropsFromState {}

export const mapStateToProps = (store: any) => ({
  settings: store.settings,
});

export const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      openSidebarAndHeader,
      loading,
    },
    dispatch
  );
