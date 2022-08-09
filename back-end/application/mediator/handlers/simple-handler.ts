import { Authorize, RegisterHandler, ICommandHandler, ICommand, Result } from '../index';

export class SimpleCommand implements ICommand {
  declare partyId: number;
}

@RegisterHandler
export class SimpleCommandHandler implements ICommandHandler<SimpleCommand, Result> {
  handle(command: SimpleCommand): Result {
    console.log({ partyId: command.partyId });
  }
}
