import axios from 'axios';
import CryptoJS from 'crypto-js';
import ENV from '@config';
import { Authorize, ICommandHandler, AuthorizeCommand } from '@qnn92/mediatorts';
import { bnbService } from '@application/handlers/bnb/service';
import { OpenOrder } from '@libs/bnb';

export class GetOpenOrdersCommand extends AuthorizeCommand {
  symbol: string;
  constructor(accessToken: string, symbol: string) {
    super(accessToken);
    this.symbol = symbol;
  }
}

@Authorize()
export class GetOpenOrdersCommandHandler implements ICommandHandler<GetOpenOrdersCommand, void> {
  async handle(command: GetOpenOrdersCommand): Promise<void> {
    const serverTime = await bnbService.getServerTime();

    const query = `symbol=${command.symbol}&timestamp=${serverTime}`;
    const signature = CryptoJS.HmacSHA256(query, ENV.BNB_SECRET_KEY).toString(CryptoJS.enc.Hex);

    const fapi = axios.create({
      baseURL: 'https://fapi.binance.com',
      headers: { 'X-MBX-APIKEY': ENV.BNB_API_KEY },
    });
    var res = await fapi.get(`/fapi/v1/openOrders?${query}&signature=${signature}`);
    console.log(res.data);
    return res.data.map((x: any) => new OpenOrder(x));
  }
}
