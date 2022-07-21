export interface ICommand {}
export class AuthorizeCommand implements ICommand {
  accessToken: string = '';
}
export type Result = void | string | {};
export interface ICommandHandler<T extends ICommand, Result> {
  handle: (command: T) => Result;
}

export interface IContainer {
  readonly handlers: { [id: string]: Function };
}

export interface IMediatorMiddleware {
  preProcess: (request: ICommand) => Promise<void>;
  postProcess: (request: ICommand, response: Result) => Promise<void>;
}
