import { Kline } from 'shared/bnb';
export enum ACTION {
  GET_KLINES = 'GET_KLINES',
}

export class BnbState {
  klines: Kline[] = [];
  pendingTypes: string[] = [];
  removePending(pendingType: string): void {
    this.pendingTypes = this.pendingTypes.filter(
      (pt) => pt !== pendingType.replace('_REJECTED', '').replace('_FULFILLED', '')
    );
  }
}
