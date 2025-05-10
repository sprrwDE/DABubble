import { Message } from './message.model';

export class DirectChat {
  userIds: string[];
  id?: string;
  messages?: Message[];

  constructor(obj?: any) {
    this.userIds = obj?.userIds || [];
    this.id = obj?.id || '';
    this.messages = obj?.messages || [];
  }

  toJSON() {
    return {
      userIds: this.userIds,
    };
  }
}
