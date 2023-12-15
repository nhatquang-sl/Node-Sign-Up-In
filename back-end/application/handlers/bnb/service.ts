import axios, { AxiosInstance } from 'axios';

export class BnbService {
  fapi: AxiosInstance;

  constructor() {
    this.fapi = axios.create({ baseURL: 'https://fapi.binance.com' });
  }

  getServerTime = async () => {
    var res = await this.fapi.get('fapi/v1/time');
    return res.data['serverTime'];
  };
}

export const bnbService = new BnbService();
