export interface ICommand {}
export type Result = void | string | {};
export interface ICommandHandler<T extends ICommand, Result> {
  handle: (command: T) => Result;
}
type IHandler = Function;
export interface IContainer {
  readonly handlers: { [id: string]: IHandler };
}
