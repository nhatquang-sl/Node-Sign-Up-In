import { IContainer } from './interfaces';

export namespace MContainer {
  export const container: IContainer = {
    handlers: {},
  };

  export function RegisterHandler<T>(handler: { new (): T }): void {
    const handlerName = handler.name.toString();
    if (handlerName) container.handlers[handlerName] = handler;

    // console.log(handler);
    // console.log({ handlerName });
    // console.log(`${handlerName}Handler`);
    // console.log({ handlerCode: handler.toString() });
  }
}
