import { bindActionCreators, Dispatch } from 'redux';
import { showSnackbar } from 'store/snackbar/actions';
import { getKlines } from 'store/bnb/actions';
import { SettingsState } from 'store/settings/types';
import { AuthState } from 'store/auth/types';
import { BnbState } from 'store/bnb/types';
import { Position, OpenOrder } from 'shared/bnb';

interface PropsFromDispatch {
  showSnackbar: typeof showSnackbar;
  getKlines: typeof getKlines;
}

interface PropsFromState {
  settings: SettingsState;
  auth: AuthState;
  bnb: BnbState;
}

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
export interface Props extends PropsFromDispatch, PropsFromState {}

export type PositionProps = {
  positions: Position[];
};

export type OpenOrdersProps = {
  orders: OpenOrder[];
};

export type IndicatorsProps = {
  indicators: Indicator[];
  currentPrice: number;
};

export type OrderFormProps = {
  entryEstimate: number;
  liqEstimate: number;
  onSuccess(order: OpenOrder): void;
};

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
