import { bindActionCreators, Dispatch } from 'redux';

interface PropsFromDispatch {}

interface PropsFromState {}

export interface Props extends PropsFromDispatch, PropsFromState {}

export const mapStateToProps = (store: any) => ({});

export const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({}, dispatch);
