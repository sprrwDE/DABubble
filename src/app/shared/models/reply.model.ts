export class Reply {
    message: string;
    user: string;
    timestamp: Date;
  
    constructor(obj?: any) {
      this.message = obj?.message || '';
      this.user = obj?.user || '';
      this.timestamp = obj?.timestamp ? new Date(obj.timestamp) : new Date();
    }
  
    toJSON() {
      return {
        message: this.message,
        user: this.user,
        timestamp: this.timestamp.toISOString(),
      };
    }
  }
