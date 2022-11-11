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
} from '@application/mediator';
import { BadRequestError } from '@application/common/exceptions';
import { bnbService } from '@application/handlers/bnb/service';
import { OpenOrder } from '@libs/bnb';

export class CancelOrderCommand extends AuthorizeCommand {
  orderId: string;
  symbol: string;
  constructor(accessToken: string, symbol: string, orderId: string) {
    super(accessToken);
    this.orderId = orderId;
    this.symbol = symbol;
  }
}

@Authorize()
export class CancelOrderCommandHandler implements ICommandHandler<CancelOrderCommand, OpenOrder> {
  async handle(command: CancelOrderCommand): Promise<OpenOrder> {
    const serverTime = await bnbService.getServerTime();

    const request = qs.stringify({
      orderId: command.orderId,
      symbol: command.symbol,
      timestamp: serverTime,
    });
    const signature = CryptoJS.HmacSHA256(request, ENV.BNB_SECRET_KEY).toString(CryptoJS.enc.Hex);

    const fapi = axios.create({
      baseURL: 'https://fapi.binance.com',
      headers: { 'X-MBX-APIKEY': ENV.BNB_API_KEY },
    });
    var res = await fapi.delete(`/fapi/v1/order?${request}&signature=${signature}`);
    return new OpenOrder(res.data);
  }
}

@RegisterValidator
export class CancelOrderCommandValidator implements ICommandValidator<CancelOrderCommand> {
  async validate(command: CancelOrderCommand): Promise<void> {
    console.log({ command });
    let error = [];
    let id = 0;
    try {
      id = parseInt(command.orderId);
      if (id <= 0) error.push(LANG.BNB_ORDER_ID_MISSING_ERROR);
    } catch (err) {
      error.push(LANG.BNB_ORDER_ID_MISSING_ERROR);
    }
    if (!command.symbol?.length) error.push(LANG.BNB_SYMBOL_MISSING_ERROR);
    if (error.length > 0) throw new BadRequestError(error);
  }
}
