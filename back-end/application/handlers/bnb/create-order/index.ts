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

export class CreateOrderCommand extends AuthorizeCommand {
  symbol: string;
  side: string;
  type: string = 'LIMIT';
  timeInForce: string = 'GTC';
  quantity: number;
  price: number;
  constructor(accessToken: string, obj: any) {
    super(accessToken);
    this.symbol = obj?.symbol;
    this.side = obj?.side;
    this.quantity = obj?.quantity;
    this.price = obj?.price;
  }
}

@Authorize()
export class CreateOrderCommandHandler implements ICommandHandler<CreateOrderCommand, OpenOrder> {
  async handle(command: CreateOrderCommand): Promise<OpenOrder> {
    const serverTime = await bnbService.getServerTime();

    const query = qs.stringify({
      symbol: command.symbol,
      side: command.side,
      type: command.type,
      quantity: command.quantity,
      price: command.price,
      timestamp: serverTime,
      timeInForce: command.timeInForce,
    });
    const signature = CryptoJS.HmacSHA256(query, ENV.BNB_SECRET_KEY).toString(CryptoJS.enc.Hex);
    console.log({ query });
    // `symbol=${command.symbol}&timestamp=${serverTime}`;

    const fapi = axios.create({
      baseURL: 'https://fapi.binance.com',
      headers: { 'X-MBX-APIKEY': ENV.BNB_API_KEY },
    });
    var res = await fapi.post(`/fapi/v1/order`, `${query}&signature=${signature}`);
    return new OpenOrder(res.data);
  }
}

@RegisterValidator
export class CreateOrderCommandValidator implements ICommandValidator<CreateOrderCommand> {
  async validate(command: CreateOrderCommand): Promise<void> {
    console.log({ command });
    let error = [];
    if (!command.type?.length) error.push(LANG.BNB_TYPE_MISSING_ERROR);
    if (!command.side?.length) error.push(LANG.BNB_SIDE_MISSING_ERROR);
    if (!command.symbol?.length) error.push(LANG.BNB_SYMBOL_MISSING_ERROR);
    if (command.quantity <= 0) error.push(LANG.BNB_QUANTITY_MISSING_ERROR);

    if (error.length > 0) throw new BadRequestError(error);
  }
}
