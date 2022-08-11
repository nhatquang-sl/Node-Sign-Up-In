export interface ICommand {}
export class AuthorizeCommand implements ICommand {
  accessToken: string = '';
}
export type Result = void | string | {};
export interface ICommandHandler<T extends ICommand, Result> {
  handle: (command: T) => Promise<Result>;
}

export interface IContainer {
  readonly handlers: { [id: string]: Function };
}

export interface IPipelineBehavior {
  handle: (request: ICommand, next: () => Promise<any>) => Promise<any>;
}
