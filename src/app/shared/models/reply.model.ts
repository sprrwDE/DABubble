export class Reply {
  message: string;
  userId: string;
  timestamp: number;

  constructor(obj?: any) {
    this.message = obj?.message || '';
    this.userId = obj?.user || '';
    this.timestamp = obj?.timestamp || null;
    // this.timestamp = obj?.timestamp ? new Date(obj.timestamp) : new Date();
  }

  toJSON() {
    return {
      message: this.message,
      user: this.userId,
      timestamp: this.timestamp,
    };
  }
}
