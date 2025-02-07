import { Reply } from './reply.model';

export interface Reaction {
  emoji: string;
  count: number;
  userIds: string[]; // Optional: Liste der User, die reagiert haben
}

export class Message {
  message: string;
  userId: string;
  // likes: number;
  likes: Reaction[];
  timestamp: number;
  replies?: Reply[];
  id?: string;

  constructor(obj?: any) {
    this.message = obj?.message || '';
    this.userId = obj?.userId || '';
    // this.likes = obj?.likes || 0;
    this.likes = obj?.likes // Falls likes direkt existiert, benutze es
    ? obj.likes.map((like: any) => ({
        emoji: like.emoji,
        count: like.count,
        userIds: like.userIds || [],
      }))
    : obj?.reactions // Falls reactions existiert, nutze es stattdessen
    ? obj.reactions.map((reaction: any) => ({
        emoji: reaction.emoji,
        count: reaction.count,
        userIds: reaction.userIds || [],
      }))
    : [];
      this.timestamp = obj?.timestamp || null;
    this.replies = obj?.replies
      ? obj.replies.map((rep: any) => new Reply(rep))
      : [];
    this.id = obj?.id || '';
  }

  toJSON() {
    return {
      message: this.message,
      userId: this.userId,
      likes: this.likes,
      timestamp: this.timestamp,
    };
  }
}
