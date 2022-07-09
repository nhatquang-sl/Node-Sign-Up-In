import { ICommand, Result } from './interfaces';
import { MContainer } from './container';

export class Mediator {
  public send(command: ICommand): Result {
    const cmdName = command.constructor.name;
    const handlerClass: any = MContainer.container.handlers[`${cmdName}Handler`];
    const handler: any = new handlerClass();
    if (handler.handle) handler.handle(command);
  }
}
