import { IContainer } from './interfaces';

export const container: IContainer = {
  handlers: {},
  validators: {},
};

// https://www.typescriptlang.org/docs/handbook/decorators.html#class-decorators
export function RegisterHandler<T>(handler: { new (): T }): void {
  const handlerName = handler.name.toString();
  if (handlerName) container.handlers[handlerName] = handler;

  // console.log(handler);
  // console.log({ handlerName });
  // console.log(`${handlerName}Handler`);
  // console.log({ handlerCode: handler.toString() });
}

export function RegisterValidator<T>(handler: { new (): T }): void {
  const handlerName = handler.name.toString();
  if (handlerName) container.validators[handlerName] = handler;
}

// https://dev.to/danywalls/decorators-in-typescript-with-example-part-1-m0f
export function Authorize(roles: string[] = []) {
  return function (constructor: Function) {
    const handlerName = constructor.name.toString();
    if (handlerName) container.handlers[handlerName] = constructor;
    constructor.prototype.authorizeRoles = roles;
  };
}
