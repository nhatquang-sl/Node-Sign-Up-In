export class State {
  constructor(emailAddress: string = '') {
    this.emailAddress = emailAddress;
  }
  emailAddress: string;
  emailAddressError: string | undefined = undefined;
  submitted: boolean = false;
}
