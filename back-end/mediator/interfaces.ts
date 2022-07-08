export interface ICommandHandler<T, K> {
  handle: (command: T) => K;
}

type IHandler = Function;
export interface IContainer {
  readonly handlers: { [id: string]: IHandler };
}
