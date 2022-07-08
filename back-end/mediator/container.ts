import { IContainer, ICommandHandler } from './interfaces';

export namespace MContainer {
  export const container: IContainer = {
    handlers: {},
  };

  export function RegisterHandler<T>(handler: { new (): T }): void {
    console.log('===========================================');
    console.log(handler);
    console.log(handler.prototype);
    var h: any = new handler();
    console.log(h.handle('==============in container'));
    container.handlers[handler.prototype.name] = handler;
  }
}
