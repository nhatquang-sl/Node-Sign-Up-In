import { ICommand, ICommandHandler, Result, IMediatorMiddleware } from './interfaces';
import { container } from './container';
import { UnauthorizedError } from '../common/exceptions';

export class Mediator {
  private middlewares: IMediatorMiddleware[] = [];

  public use(middleware: IMediatorMiddleware): void {
    this.middlewares.push(middleware);
  }

  public async send(command: ICommand): Promise<Result> {
    const cmdName = command.constructor.name;
    const handlerClass: any = container.handlers[`${cmdName}Handler`];
    const handler: ICommandHandler<ICommand, Result> = new handlerClass();

    try {
      for (const m of this.middlewares) {
        const result = await m.preProcess(command);
        if (result !== undefined) console.log({ result });
      }
    } catch (err) {
      console.log('---------------------------');
      if (err instanceof UnauthorizedError) {
        console.log('---error instanceof UnauthorizedError');
      }
    }

    if (handlerClass.prototype.authorizeRoles?.length > 0)
      console.log({ authorizeRoles: handlerClass.prototype.authorizeRoles });

    if (handler.handle) handler.handle(command);
  }
}

export const mediator = new Mediator();
