export class Message {
    id!: string;
    message: string;
    userId: string;
    likes: number;
    timestamp: number;
  
    constructor(obj?: any) {
      this.id = obj?.id || '';
      this.message = obj?.message || '';
      this.userId = obj?.userId || '';
      this.likes = obj?.likes || 0;
      this.timestamp = obj?.timestamp || Date.now();
    }
  
    toJSON() {
      return {
        id: this.id,
        message: this.message,
        userId: this.userId,
        likes: this.likes,
        timestamp: this.timestamp,
      };
    }
  }
  