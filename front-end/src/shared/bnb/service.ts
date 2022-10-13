import axios, { AxiosInstance } from 'axios';
import { Kline } from './dto';

export class BnbService {
  fapi: AxiosInstance;
  api: AxiosInstance;
  constructor() {
    this.fapi = axios.create({
      baseURL: 'https://fapi.binance.com',
    });

    this.api = axios.create({
      baseURL: 'https://api.binance.com',
    });
  }

  getServerTime = async () => {
    var res = await this.api.get('/api/v3/time');
    return res.data['serverTime'];
  };

  getKlines = async (symbol: string, interval: string, limit: number = 1000) => {
    const klines: Kline[] = [];
    const res = await this.api.get(
      `/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`
    );

    for (const kline of res.data) {
      klines.push(new Kline(kline));
    }
    return klines;
  };
}

export default new BnbService();
