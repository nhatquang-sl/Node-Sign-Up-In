import { bindActionCreators, Dispatch } from 'redux';
import { SettingsState } from 'store/settings/types';

interface PropsFromState {
  settings: SettingsState;
}

export interface Props extends PropsFromState {}

export const mapStateToProps = (store: any) => ({
  settings: store.settings,
});

export const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({}, dispatch);
