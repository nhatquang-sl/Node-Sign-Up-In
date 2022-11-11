import axios from 'axios';
import CryptoJS from 'crypto-js';
import ENV from '@config';
import { Authorize, ICommandHandler, AuthorizeCommand } from '@application/mediator';
import { bnbService } from '@application/handlers/bnb/service';
import { Balance } from '@libs/bnb';

export class GetBalanceCommand extends AuthorizeCommand {
  constructor(accessToken: string) {
    super(accessToken);
  }
}

@Authorize()
export class GetBalanceCommandHandler implements ICommandHandler<GetBalanceCommand, void> {
  async handle(command: GetBalanceCommand): Promise<void> {
    const serverTime = await bnbService.getServerTime();

    const query = `timestamp=${serverTime}`;
    const signature = CryptoJS.HmacSHA256(query, ENV.BNB_SECRET_KEY).toString(CryptoJS.enc.Hex);

    const fapi = axios.create({
      baseURL: 'https://fapi.binance.com',
      headers: { 'X-MBX-APIKEY': ENV.BNB_API_KEY },
    });
    var res = await fapi.get(`fapi/v2/balance?${query}&signature=${signature}`);
    console.log(res.data);
    return res.data.map((x: any) => new Balance(x));
  }
}
