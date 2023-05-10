import { CalculateChartCommand } from '@application/handlers/chart/calculate';
import { GetDivergentUpCommand } from '@application/handlers/chart/get-divergent-up';
import { Mediator } from '@application/mediator';
import { bnbService, Kline } from '@libs/bnb';
import { HOUR } from '@libs/constant/timestamp';

export default class ScanEventWorker {
  symbol: string;
  interval: string;
  constructor(symbol: string, interval: string) {
    this.symbol = symbol;
    this.interval = interval;
  }

  run = async () => {
    const mediator = new Mediator();
    const { symbol, interval } = this;

    let klines = await bnbService.getKlines(symbol, interval);
    klines = (await mediator.send(new CalculateChartCommand(klines))) as Kline[];
    const divergentUp = await mediator.send<Kline | undefined>(new GetDivergentUpCommand(klines));
    if (divergentUp) {
      // TODO: Alert to telegram
    }
    let intervalMs = 0;
    switch (interval) {
      case '4h':
        intervalMs = 4 * HOUR;
        break;
    }

    setInterval(async () => {
      let newKlines = await bnbService.getKlines(symbol, interval, 1);
      const lstKline = newKlines[0];
      if (klines[klines.length - 1].openTime === lstKline.openTime)
        klines[klines.length - 1] = lstKline;
      else klines.push(lstKline);

      klines = (await mediator.send(new CalculateChartCommand(klines))) as Kline[];
      const divergentUp = await mediator.send<Kline | undefined>(new GetDivergentUpCommand(klines));
      if (divergentUp) {
        // TODO: Alert to telegram
      }
    }, intervalMs);
  };
}
