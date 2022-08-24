import { delay } from '@application/common/utils';
import {
  RegisterHandler,
  RegisterValidator,
  ICommandHandler,
  ICommandValidator,
  ICommand,
  Result,
} from '@application/mediator';
import { BadRequestError } from '@application/common/exceptions';

export class TestCommand implements ICommand {
  constructor(partyId: number) {
    this.partyId = partyId;
  }
  declare partyId: number;
}

@RegisterHandler
export class TestCommandHandler implements ICommandHandler<TestCommand, Result> {
  async handle(command: TestCommand): Promise<Result> {
    await delay(0);
    return `message from TestCommandHandler with partyId: ${command.partyId}`;
  }
}

@RegisterValidator
export class TestCommandValidator implements ICommandValidator<TestCommand> {
  async validate(command: TestCommand): Promise<void> {
    if (command.partyId <= 0)
      throw new BadRequestError({ message: 'The partyId must be greater than 0' });
  }
}
