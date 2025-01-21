export class Reply {
  message: string;
  userId: string;
  timestamp: number;

  constructor(obj?: any) {
    this.message = obj?.message || '';
    this.userId = obj?.userId || '';
    this.timestamp = obj?.timestamp || null;
  }

  toJSON() {
    return {
      message: this.message,
      userId: this.userId,
      timestamp: this.timestamp,
    };
  }
}
