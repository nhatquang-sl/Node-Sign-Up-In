import { delay } from '@controllers/auth/utils/index';
import { RegisterHandler, ICommandHandler, ICommand, Result } from '@application/mediator';

export class TestCommand implements ICommand {
  constructor(partyId: number) {
    this.partyId = partyId;
  }
  declare partyId: number;
}
// console.log('test handler');
@RegisterHandler
export class TestCommandHandler implements ICommandHandler<TestCommand, Result> {
  async handle(command: TestCommand): Promise<Result> {
    await delay(0);
    return `message from TestCommandHandler with partyId: ${command.partyId}`;
  }
}
