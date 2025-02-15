export class Reply {
  message: string;
  userId: string;
  timestamp: number;
  id: string;

  constructor(obj?: any) {
    this.message = obj?.message || '';
    this.userId = obj?.userId || '';
    this.timestamp = obj?.timestamp || null;
    this.id = obj?.id || ''
  }

  toJSON() {
    return {
      message: this.message,
      userId: this.userId,
      timestamp: this.timestamp,
      id: this.id
    };
  }
}
