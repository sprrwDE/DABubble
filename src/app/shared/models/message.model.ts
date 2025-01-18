import { Reply } from './reply.model';

export class Message {
  message: string;
  userId: string;
  likes: number;
  timestamp: number;
  replies: Reply[];

  constructor(obj?: any) {
    this.message = obj?.message || '';
    this.userId = obj?.user || '';
    this.likes = obj?.likes || 0;
    // this.timestamp = obj?.timestamp ? new Date(obj.timestamp) : new Date();
    this.timestamp = obj?.timestamp || null;
    this.replies = obj?.replies
      ? obj.replies.map((rep: any) => new Reply(rep))
      : [];
  }

  toJSON() {
    return {
      message: this.message,
      userId: this.userId,
      likes: this.likes,
      timestamp: this.timestamp,
      replies: this.replies.map((rep) => rep.toJSON()),
    };
  }
}
