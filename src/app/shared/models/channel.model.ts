import { Message } from './message.model';

export class Channel {
  id!: string;
  name: string;
  users: string[];
  messages: Message[];

  constructor(obj?: any) {
    this.id = obj?.id || '';
    this.name = obj?.name || '';
    this.users = obj?.users || [];
    this.messages = obj?.messages
      ? obj.messages.map((msg: any) => new Message(msg))
      : [];
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      users: this.users,
      messages: this.messages.map((msg) => msg.toJSON()),
    };
  }
}
