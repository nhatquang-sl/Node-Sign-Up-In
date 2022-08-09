import { Authorize, ICommandHandler, Result, AuthorizeCommand } from '../index';

export class ExampleAuthorizeCommand extends AuthorizeCommand {
  declare partyId: number;
}

// @Authorize(['admin'])
@Authorize()
export class ExampleAuthorizeCommandHandler
  implements ICommandHandler<ExampleAuthorizeCommand, Result>
{
  handle(command: ExampleAuthorizeCommand): Result {
    console.log('ExampleAuthorizeCommandHandler', { partyId: command.partyId });
  }
}
