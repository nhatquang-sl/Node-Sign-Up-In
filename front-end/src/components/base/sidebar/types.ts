import { bindActionCreators, Dispatch } from 'redux';
import { closeSidebar } from 'store/settings/actions';
import { SettingsState } from 'store/settings/types';

interface PropsFromDispatch {
  closeSidebar: typeof closeSidebar;
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
      closeSidebar,
    },
    dispatch
  );
