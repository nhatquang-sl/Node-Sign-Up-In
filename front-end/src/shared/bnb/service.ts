import axios, { AxiosInstance } from 'axios';
import { Kline } from './dto';

export class BnbService {
  fapi: AxiosInstance;
  apiKey: string;
  secretKey: string;

  constructor(apiKey: string = '', secretKey: string = '') {
    this.apiKey = apiKey;
    this.secretKey = secretKey;
    this.fapi = axios.create({
      baseURL: 'https://fapi.binance.com',
      headers: { 'X-MBX-APIKEY': this.apiKey },
    });
  }

  getServerTime = async () => {
    var res = await this.fapi.get('/fapi/v1/time');
    return res.data['serverTime'];
  };

  getKlines = async (symbol: string, interval: string, limit: number = 1000) => {
    const klines: Kline[] = [];
    const res = await this.fapi.get(
      `/fapi/v1/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`
    );

    for (const kline of res.data) {
      klines.push(new Kline(kline));
    }
    return klines;
  };

  getListenKey = async () => {
    var res = await this.fapi.post('/fapi/v1/listenKey');

    return res.data['listenKey'];
  };

  getAllOrders = async (query: string) => {
    var res = await this.fapi.get(`/fapi/v2/positionRisk?${query}`);
    return res.data;
  };
}

export default new BnbService();
