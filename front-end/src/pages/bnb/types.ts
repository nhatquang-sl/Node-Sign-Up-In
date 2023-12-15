import { bindActionCreators, Dispatch } from 'redux';

interface PropsFromDispatch {}

interface PropsFromState {}

export interface Props extends PropsFromDispatch, PropsFromState {}

export const mapStateToProps = () => ({});

export const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({}, dispatch);

export class Indicator {
  constructor(interval: string) {
    this.interval = interval;
  }
  interval: string;
  rsi: number = 0;
  sma20: number = 0;
  bolu: number = 0;
  bold: number = 0;
}
