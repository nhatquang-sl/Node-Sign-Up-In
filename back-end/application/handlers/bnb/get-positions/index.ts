import axios from 'axios';
import CryptoJS from 'crypto-js';
import LANG from '@libs/lang';
import ENV from '@config';
import { User } from '@database';
import { Authorize, ICommandHandler, AuthorizeCommand } from '@application/mediator';
import { NotFoundError } from '@application/common/exceptions';
import { BnbService } from '@libs/bnb/service';

export class GetPositionsCommand extends AuthorizeCommand {
  symbol: string;
  constructor(accessToken: string, symbol: string) {
    super(accessToken);
    this.symbol = symbol;
  }
}

@Authorize()
export class GetPositionsCommandHandler implements ICommandHandler<GetPositionsCommand, void> {
  async handle(command: GetPositionsCommand): Promise<void> {
    // https://sequelize.org/docs/v6/core-concepts/model-querying-finders/#findone
    const user = await User.findOne({ where: { id: command.userId } });
    if (user === null) throw new NotFoundError({ message: LANG.USER_NOT_FOUND_ERROR });
    const bnbService = new BnbService(ENV.BNB_API_KEY, ENV.BNB_SECRET_KEY);
    const serverTime = await bnbService.getServerTime();

    const query = `symbol=${command.symbol}&timestamp=${serverTime}`;
    const signature = CryptoJS.HmacSHA256(query, ENV.BNB_SECRET_KEY).toString(CryptoJS.enc.Hex);

    const fapi = axios.create({
      baseURL: 'https://fapi.binance.com',
      headers: { 'X-MBX-APIKEY': ENV.BNB_API_KEY },
    });
    var res = await fapi.get(`/fapi/v2/positionRisk?${query}&signature=${signature}`);
    console.log(res);
    return res.data;
  }
}
