import { UserSession } from 'shared/user/dto';

export enum USER_TYPE {
  GET_USER_SESSIONS = 'GET_USER_SESSIONS',
}

// interface Dictionary<T> {
//   [key: string]: T;
// }

export class UserState {
  pendingTypes: string[] = [];
  sessions: UserSession[] = [];

  removePending(pendingType: string): void {
    this.pendingTypes = this.pendingTypes.filter((pt) => pt !== pendingType);
  }
}
