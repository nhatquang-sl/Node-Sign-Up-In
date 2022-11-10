import { bindActionCreators, Dispatch } from 'redux';
import { openSidebar, closeSidebarAndHeader, openHeader, loading } from 'store/settings/actions';
import { SettingsState } from 'store/settings/types';

interface PropsFromDispatch {
  openSidebar: typeof openSidebar;
  closeSidebarAndHeader: typeof closeSidebarAndHeader;
  loading: typeof loading;
  openHeader: typeof openHeader;
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
      openSidebar,
      closeSidebarAndHeader,
      loading,
      openHeader,
    },
    dispatch
  );
