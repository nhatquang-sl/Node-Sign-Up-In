import { bindActionCreators, Dispatch } from 'redux';

import { Position, OpenOrder } from 'shared/bnb';

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

export type PositionProps = {
  positions: Position[];
};

export type OpenOrdersProps = {
  orders: OpenOrder[];
  cancel: (symbol: string, orderId: number) => Promise<number>;
  cancelAll: (symbol: string) => Promise<void>;
};

export type IndicatorsProps = {
  indicators: Indicator[];
  currentPrice: number;
};

export type OrderFormProps = {
  entryEstimate: number;
  liqEstimate: number;
  usdtAvailable: number;
  onSuccess(order: OpenOrder): void;
};
