import { mediator } from '@application/mediator';
import { TestCommand } from './test-handler';

test('CommandHandler return a string message', async () => {
  let result = (await mediator.send(new TestCommand(10))) as string;
  expect(result).toEqual(`message from TestCommandHandler with partyId: 10`);
});
