import { Message } from './message.model';

export class Channel {
  id!: string;
  name: string;
  description: string;
  users: string[];
  channelCreatorId: string;
  messages?: Message[];

  constructor(obj?: any) {
    this.id = obj?.id || '';
    this.name = obj?.name || '';
    this.description = obj?.description || '';
    this.users = obj?.users || [];
    this.channelCreatorId = obj?.createdBy || '';
    this.messages = obj?.messages
      ? obj.messages.map((msg: any) => new Message(msg))
      : [];
  }

  toJSON() {
    return {
      name: this.name,
      description: this.description,
      users: this.users,
      createdBy: this.channelCreatorId,
    };
  }
}
