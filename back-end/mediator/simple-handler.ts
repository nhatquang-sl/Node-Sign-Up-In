import { MContainer, ICommandHandler } from './index';

@MContainer.RegisterHandler
export default class SimpleHandler implements ICommandHandler<string, string> {
  constructor() {
    console.log('Registering Simple_Handler');
  }

  handle(payload: string): string {
    return `handle: ${payload}`;
  }
}
