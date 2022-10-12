export class Kline {
  openTime: number;
  openPrice: number;
  highPrice: number;
  lowPrice: number;
  closePrice: number;
  volume: number;
  closeTime: number;
  quoteAssetVolume: number;
  numberOfTrades: number;
  takerBuyBaseAssetVolume: number;
  takerBuyQuoteAssetVolume: number;

  constructor(kline: any[]) {
    this.openTime = kline[0];
    this.openPrice = parseFloat(kline[1]);
    this.highPrice = parseFloat(kline[2]);
    this.lowPrice = parseFloat(kline[3]);
    this.closePrice = parseFloat(kline[4]);
    this.volume = parseFloat(kline[5]);
    this.closeTime = kline[6];
    this.quoteAssetVolume = parseFloat(kline[7]);
    this.numberOfTrades = kline[8];
    this.takerBuyBaseAssetVolume = parseFloat(kline[9]);
    this.takerBuyQuoteAssetVolume = parseFloat(kline[10]);
  }
}
