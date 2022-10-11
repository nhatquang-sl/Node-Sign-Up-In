import axios, { AxiosInstance } from 'axios';
export class BnbService {
  instance: AxiosInstance;
  constructor() {
    this.instance = axios.create({
      baseURL: 'https://fapi.binance.com',
    });
  }

  getServerTime = async () => {
    var res = await this.instance.get('/fapi/v1/time');
    console.log(res.data['serverTime']);
    return res.data['serverTime'];
  };
}

export default new BnbService();
