export class Kline {
  openTime: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  closeTime: number;
  quoteAssetVolume: number;
  numberOfTrades: number;
  takerBuyBaseAssetVolume: number;
  takerBuyQuoteAssetVolume: number;
  gain: number = 0;
  loss: number = 0;

  constructor(kline: any[] = []) {
    this.openTime = kline[0];
    this.open = parseFloat(kline[1]);
    this.high = parseFloat(kline[2]);
    this.low = parseFloat(kline[3]);
    this.close = parseFloat(kline[4]);
    this.volume = parseFloat(kline[5]);
    this.closeTime = kline[6];
    this.quoteAssetVolume = parseFloat(kline[7]);
    this.numberOfTrades = kline[8];
    this.takerBuyBaseAssetVolume = parseFloat(kline[9]);
    this.takerBuyQuoteAssetVolume = parseFloat(kline[10]);
  }
}

export class Position {
  symbol: string;
  positionAmt: number;
  entryPrice: number;
  markPrice: number;
  unRealizedProfit: number;
  liquidationPrice: number;
  leverage: number;
  maxNotionalValue: number;
  marginType: string;
  isolatedMargin: number;
  isAutoAddMargin: boolean;
  positionSide: string;
  notional: number;
  isolatedWallet: number;
  updateTime: number;
  constructor(p: any) {
    this.symbol = p.symbol;
    this.positionAmt = parseFloat(p.positionAmt);
    this.entryPrice = parseFloat(p.entryPrice);
    this.markPrice = parseFloat(p.markPrice);
    this.unRealizedProfit = parseFloat(p.unRealizedProfit);
    this.liquidationPrice = parseFloat(p.liquidationPrice);
    this.leverage = parseFloat(p.leverage);
    this.maxNotionalValue = parseFloat(p.maxNotionalValue);
    this.marginType = p.marginType;
    this.isolatedMargin = parseFloat(p.isolatedMargin);
    this.isAutoAddMargin = p.isAutoAddMargin === 'true';
    this.positionSide = p.positionSide;
    this.notional = parseFloat(p.notional);
    this.isolatedWallet = parseFloat(p.isolatedWallet);
    this.updateTime = p.updateTime;
  }
}

// {
//   orderId: 12080085782,
//   symbol: 'NEARUSDT',
//   status: 'NEW',
//   clientOrderId: 'web_4cJaRw9Q4RzGFfcjFNcB',
//   price: '2.6800',
//   avgPrice: '0',
//   origQty: '11',
//   executedQty: '0',
//   cumQuote: '0',
//   timeInForce: 'GTC',
//   type: 'LIMIT',
//   reduceOnly: false,
//   closePosition: false,
//   side: 'BUY',
//   positionSide: 'BOTH',
//   stopPrice: '0',
//   workingType: 'CONTRACT_PRICE',
//   priceProtect: false,
//   origType: 'LIMIT',
//   time: 1666354910383,
//   updateTime: 1666354910383
// }
export class OpenOrder {
  constructor(o: any = {}) {
    this.orderId = o.orderId ?? 0;
    this.symbol = o.symbol ?? '';
    this.status = o.status ?? '';
    this.clientOrderId = o.clientOrderId ?? '';
    this.price = parseFloat(o.price ?? 0);
    this.avgPrice = parseFloat(o.avgPrice ?? 0);
    this.origQty = parseFloat(o.origQty ?? 0);
    this.executedQty = parseFloat(o.executedQty ?? 0);
    this.cumQuote = parseFloat(o.cumQuote ?? 0);
    this.timeInForce = o.timeInForce ?? '';
    this.type = o.type ?? '';
    this.reduceOnly = o.reduceOnly ?? false;
    this.closePosition = o.closePosition ?? false;
    this.side = o.side ?? '';
    this.positionSide = o.positionSide ?? '';
    this.stopPrice = parseFloat(o.stopPrice ?? 0);
    this.workingType = o.workingType ?? '';
    this.priceProtect = o.priceProtect ?? false;
    this.origType = o.origType ?? '';
    this.time = o.time ?? 0;
    this.updateTime = o.updateTime ?? 0;
  }
  orderId: number;
  symbol: string;
  status: string;
  clientOrderId: string;
  price: number;
  avgPrice: number;
  origQty: number;
  executedQty: number;
  cumQuote: number;
  timeInForce: string;
  type: string;
  reduceOnly: boolean;
  closePosition: boolean;
  side: string;
  positionSide: string;
  stopPrice: number;
  workingType: string;
  priceProtect: boolean;
  origType: string;
  time: number;
  updateTime: number;
}

// [
// {
//   "accountAlias": "SgsR",    // unique account code
//   "asset": "USDT",    // asset name
//   "balance": "122607.35137903", // wallet balance
//   "crossWalletBalance": "23.72469206", // crossed wallet balance
//   "crossUnPnl": "0.00000000"  // unrealized profit of crossed positions
//   "availableBalance": "23.72469206",       // available balance
//   "maxWithdrawAmount": "23.72469206",     // maximum amount for transfer out
//   "marginAvailable": true,    // whether the asset can be used as margin in Multi-Assets mode
//   "updateTime": 1617939110373
// }
// ]
export class Balance {
  accountAlias: string;
  asset: string;
  balance: number;
  crossWalletBalance: number;
  crossUnPnl: number;
  availableBalance: number;
  maxWithdrawAmount: number;
  marginAvailable: boolean;
  updateTime: number;
  constructor(o: any = {}) {
    this.accountAlias = o.accountAlias;
    this.asset = o.asset;
    this.balance = parseFloat(o.balance ?? 0);
    this.crossWalletBalance = parseFloat(o.crossWalletBalance ?? 0);
    this.crossUnPnl = parseFloat(o.crossUnPnl ?? 0);
    this.availableBalance = parseFloat(o.availableBalance ?? 0);
    this.maxWithdrawAmount = parseFloat(o.maxWithdrawAmount ?? 0);
    this.marginAvailable = o.marginAvailable;
    this.updateTime = o.updateTime;
  }
}

export class Order {
  symbol: string = '';
  price: number = 0;
  quantity: number = 0;
  side: OrderSide = OrderSide.BUY;
}

export enum OrderSide {
  BUY = 'BUY',
  SELL = 'SELL',
}
