import { container, mediator } from '@application/mediator';
import { TestCommand } from './test-handler';

test('register handler success', async () => {
  let result = (await mediator.send(new TestCommand(1))) as string;
  expect(result).toEqual(`message from TestCommandHandler with partyId: 1`);
  expect(container.handlers['TestCommandHandler']).not.toBeNull();
});
