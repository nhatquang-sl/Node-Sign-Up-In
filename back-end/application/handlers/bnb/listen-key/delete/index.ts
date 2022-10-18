import axios from 'axios';
import LANG from '@libs/lang';
import ENV from '@config';
import { User } from '@database';
import { Authorize, ICommandHandler, AuthorizeCommand } from '@application/mediator';
import { NotFoundError } from '@application/common/exceptions';

export class DeleteListenKeyCommand extends AuthorizeCommand {
  constructor(accessToken: string) {
    super(accessToken);
  }
}

@Authorize()
export class DeleteListenKeyCommandHandler
  implements ICommandHandler<DeleteListenKeyCommand, void>
{
  async handle(command: DeleteListenKeyCommand): Promise<void> {
    // https://sequelize.org/docs/v6/core-concepts/model-querying-finders/#findone
    const user = await User.findOne({ where: { id: command.userId } });
    if (user === null) throw new NotFoundError({ message: LANG.USER_NOT_FOUND_ERROR });

    const fapi = axios.create({
      baseURL: 'https://fapi.binance.com',
      headers: { 'X-MBX-APIKEY': ENV.BNB_API_KEY },
    });

    var res = await fapi.delete('/fapi/v1/listenKey');
    return res.data;
  }
}
