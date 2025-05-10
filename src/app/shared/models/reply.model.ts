export interface Reaction {
  emoji: string;
  count: number;
  userIds: string[]; // Optional: Liste der User, die reagiert haben
}

export class Reply {
  message: string;
  userId: string;
  timestamp: number;
  id: string;
  likes: Reaction[];

  constructor(obj?: any) {
    this.message = obj?.message || '';
    this.userId = obj?.userId || '';
    this.timestamp = obj?.timestamp || null;
    this.id = obj?.id || '';
    this.likes = obj?.likes
      ? obj.likes.map((like: any) => ({
          emoji: like.emoji,
          count: like.count,
          userIds: like.userIds || [],
        }))
      : obj?.reactions
      ? obj.reactions.map((reaction: any) => ({
          emoji: reaction.emoji,
          count: reaction.count,
          userIds: reaction.userIds || [],
        }))
      : [];
  }

  toJSON() {
    return {
      message: this.message,
      userId: this.userId,
      timestamp: this.timestamp,
      id: this.id,
      likes: this.likes,
    };
  }
}
