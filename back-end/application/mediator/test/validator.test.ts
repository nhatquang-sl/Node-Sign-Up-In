import { mediator } from '@application/mediator';
import { BadRequestError } from '@application/common/exceptions';
import { TestCommand } from './test-validator';

test('CommandValidator throw BadRequestError', async () => {
  const rejects = expect(mediator.send(new TestCommand(0))).rejects;
  await rejects.toThrow(BadRequestError);
  await rejects.toThrow(JSON.stringify({ message: 'The partyId must be greater than 0' }));
});

test('CommandHandler return a string message', async () => {
  let result = (await mediator.send(new TestCommand(10))) as string;

  expect(result).toEqual(`message from TestCommandHandler with partyId: 10`);
});
