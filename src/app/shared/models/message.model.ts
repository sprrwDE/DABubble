import { Reply } from './reply.model';

export class Message {
    message: string;
    user: string;
    likes: number;
    timestamp: Date;
    replys: Reply[];
  
    constructor(obj?: any) {
      this.message = obj?.message || '';
      this.user = obj?.user || '';
      this.likes = obj?.likes || 0;
      this.timestamp = obj?.timestamp ? new Date(obj.timestamp) : new Date();
      this.replys = obj?.replys ? obj.replys.map((rep: any) => new Reply(rep)) : [];
    }
  
    toJSON() {
      return {
        message: this.message,
        user: this.user,
        likes: this.likes,
        timestamp: this.timestamp.toISOString(),
        replys: this.replys.map(rep => rep.toJSON()),
      };
    }
  }