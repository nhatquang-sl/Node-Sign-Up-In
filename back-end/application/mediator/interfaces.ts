export interface ICommand {}
export class AuthorizeCommand implements ICommand {
  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }
  declare userId: number;
  declare accessToken: string;
  declare accessTokenType: string;
}
export type Result = void | string | {};
export interface ICommandHandler<T extends ICommand, Result> {
  handle: (command: T) => Promise<Result>;
}

export interface ICommandValidator<T extends ICommand> {
  validate: (command: T) => Promise<void>;
}

export interface IContainer {
  readonly handlers: { [id: string]: Function };
  readonly validators: { [id: string]: Function };
}

export interface IPipelineBehavior {
  handle: (request: ICommand, next: () => Promise<any>) => Promise<any>;
}
