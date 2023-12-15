import axios from 'axios';
import CryptoJS from 'crypto-js';
import qs from 'qs';
import LANG from '@libs/lang';
import ENV from '@config';
import {
  Authorize,
  RegisterValidator,
  ICommandValidator,
  ICommandHandler,
  AuthorizeCommand,
  BadRequestError,
} from '@qnn92/mediatorts';
import { bnbService } from '@application/handlers/bnb/service';
import { OpenOrder } from '@libs/bnb';

export class CancelAllOrdersCommand extends AuthorizeCommand {
  symbol: string;
  constructor(accessToken: string, symbol: string) {
    super(accessToken);
    this.symbol = symbol;
  }
}

@Authorize()
export class CancelAllOrdersCommandHandler
  implements ICommandHandler<CancelAllOrdersCommand, OpenOrder>
{
  async handle(command: CancelAllOrdersCommand): Promise<OpenOrder> {
    const serverTime = await bnbService.getServerTime();

    const request = qs.stringify({
      symbol: command.symbol,
      timestamp: serverTime,
    });
    const signature = CryptoJS.HmacSHA256(request, ENV.BNB_SECRET_KEY).toString(CryptoJS.enc.Hex);

    const fapi = axios.create({
      baseURL: 'https://fapi.binance.com',
      headers: { 'X-MBX-APIKEY': ENV.BNB_API_KEY },
    });
    var res = await fapi.delete(`/fapi/v1/allOpenOrders?${request}&signature=${signature}`);
    return new OpenOrder(res.data);
  }
}

@RegisterValidator
export class CancelAllOrdersCommandValidator implements ICommandValidator<CancelAllOrdersCommand> {
  async validate(command: CancelAllOrdersCommand): Promise<void> {
    if (!command.symbol?.length) throw new BadRequestError(LANG.BNB_SYMBOL_MISSING_ERROR);
  }
}
