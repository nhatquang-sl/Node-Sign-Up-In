import {
  Authorize,
  RegisterHandler,
  ICommandHandler,
  ICommand,
  Result,
  AuthorizeCommand,
} from '../index';

export class ExampleAuthorizeCommand extends AuthorizeCommand {
  declare partyId: number;
}

@Authorize(['admin'])
export class ExampleAuthorizeCommandHandler
  implements ICommandHandler<ExampleAuthorizeCommand, Result>
{
  handle(command: ExampleAuthorizeCommand): Result {
    console.log({ partyId: command.partyId });
  }
}
