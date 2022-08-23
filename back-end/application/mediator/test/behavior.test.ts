import { delay } from '@application/common/utils';
import { mediator, IPipelineBehavior, ICommand } from '@application/mediator';
import { TestCommand } from './test-handler';

class Behavior01 implements IPipelineBehavior {
  logger: string[] = [];
  constructor(logger: string[]) {
    this.logger = logger;
  }
  handle = async (request: ICommand, next: () => Promise<any>): Promise<any> => {
    this.logger.push(`[start] 01`);
    this.logger.push(`${new Date().getTime()}`);
    this.logger.push(JSON.stringify(request));
    await delay(1000);
    const res = await next();
    this.logger.push(`${new Date().getTime()}`);
    this.logger.push('[finish] 01');
    return res;
  };
}

class Behavior02 implements IPipelineBehavior {
  logger: string[] = [];
  constructor(logger: string[]) {
    this.logger = logger;
  }
  handle = async (request: ICommand, next: () => Promise<any>): Promise<any> => {
    this.logger.push(`[start] 02`);
    this.logger.push(`${new Date().getTime()}`);
    this.logger.push(JSON.stringify(request));
    await delay(1000);
    const res = await next();
    this.logger.push(`${new Date().getTime()}`);
    this.logger.push('[finish] 02');
    return res;
  };
}

test('pipeline behavior execute by order', async () => {
  const logger: string[] = [];
  mediator.addPipelineBehavior(new Behavior01(logger));
  mediator.addPipelineBehavior(new Behavior02(logger));

  let result = (await mediator.send(new TestCommand(10))) as string;

  expect(result).toEqual(`message from TestCommandHandler with partyId: 10`);
  // console.log({ logger });
  // Behavior02 start later and finish first
  expect(logger[3]).toEqual('[start] 02');
  expect(logger[5]).toEqual('{"partyId":10}');
  expect(logger[7]).toEqual('[finish] 02');

  // Behavior02 start first and finish later
  expect(logger[0]).toEqual('[start] 01');
  expect(logger[2]).toEqual('{"partyId":10}');
  expect(logger[9]).toEqual('[finish] 01');

  // Behavior02 ran more than 1s
  expect(Number.parseInt(logger[6]) - Number.parseInt(logger[4])).toBeGreaterThan(1000);
  // Behavior02 ran more than 2s
  expect(Number.parseInt(logger[8]) - Number.parseInt(logger[1])).toBeGreaterThan(2000);
});
