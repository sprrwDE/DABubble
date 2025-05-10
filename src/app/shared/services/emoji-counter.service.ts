import { effect, Injectable } from '@angular/core';
import { UserService } from '../services/user.service';
import { FirebaseService } from './firebase.service';
import { PanelService } from './panel.service';
import { ChannelService } from './channel.service';
import { DirectChatService } from './direct-chat.service';
import { Channel } from '../models/channel.model';
import { DirectChat } from '../models/direct-chat.model';

@Injectable({
  providedIn: 'root',
})
export class EmojiCounterService {
  currentChannel: Channel = new Channel();
  currentDirectChat: DirectChat = new DirectChat();
  constructor(
    private userService: UserService,
    private firebaseService: FirebaseService,
    private panelService: PanelService,
    private channelService: ChannelService,
    private directChatService: DirectChatService
  ) {
    effect(() => {
      this.currentChannel = this.channelService.currentChannel();
    });
    effect(() => {
      this.currentDirectChat = this.directChatService.currentDirectChat();
    });
  }
  private messageLikes: Record<
    string,
    { emoji: string; count: number; userIds: string[] }[]
  > = {};

  getLikes(messageId: string) {
    return this.messageLikes[messageId] || [];
  }

  handleEmojiLogic(
    emoji: string,
    messageId: string,
    userId: string,
    channelId: string,
    previousReactions: Record<
      string,
      { emoji: string; count: number; userIds: string[] }[]
    > = {},
    isReply: boolean,
    replyId: string,
    prevRevReactions: Record<
      string,
      { emoji: string; count: number; userIds: string[] }[]
    > = {},
    isDirectChat: boolean,
    isFirstReply: boolean
  ) {
    if (!isReply || isFirstReply) {
      this.handleMessageReaction(
        emoji,
        messageId,
        userId,
        channelId,
        previousReactions
      );
    } else {
      this.handleReplyReaction(
        emoji,
        messageId,
        userId,
        channelId,
        replyId,
        prevRevReactions
      );
    }
  }

  private handleMessageReaction(
    emoji: string,
    messageId: string,
    userId: string,
    channelId: string,
    previousReactions: Record<
      string,
      { emoji: string; count: number; userIds: string[] }[]
    >
  ) {
    if (!this.messageLikes[messageId]) {
      this.messageLikes[messageId] = previousReactions[messageId]
        ? [...previousReactions[messageId]]
        : [];
    }
    const reactionIndex = this.messageLikes[messageId].findIndex(
      (item) => item.emoji === emoji
    );
    this.checkReactingUser(reactionIndex, userId, messageId, emoji);
    const collection =
      this.currentChannel.id !== '' ? 'channels' : 'direct-chats';
    this.firebaseService.updateEmojiCount(
      this.messageLikes,
      messageId,
      channelId,
      collection
    );
  }

  private handleReplyReaction(
    emoji: string,
    messageId: string,
    userId: string,
    channelId: string,
    replyId: string,
    prevRevReactions: Record<
      string,
      { emoji: string; count: number; userIds: string[] }[]
    >
  ) {
    if (!this.messageLikes[replyId]) {
      this.messageLikes[replyId] = prevRevReactions[replyId]
        ? [...prevRevReactions[replyId]]
        : [];
    }
    const reactionIndex = this.messageLikes[replyId].findIndex(
      (item) => item.emoji === emoji
    );
    this.checkReactingUserReply(reactionIndex, userId, replyId, emoji);
    const collection =
      this.currentChannel.id !== '' ? 'channels' : 'direct-chats';
    this.firebaseService.updateEmojiCountReplies(
      this.messageLikes,
      messageId,
      channelId,
      replyId,
      collection
    );
  }

  checkReactingUserReply(
    reactionIndex: number,
    userId: string,
    replyId: string,
    emoji: string
  ) {
    if (!this.messageLikes[replyId]) {
      this.messageLikes[replyId] = [];
    }

    if (reactionIndex !== -1) {
      const reaction = this.messageLikes[replyId][reactionIndex];
      this.handleReactionReply(reaction, userId, replyId);
    } else {
      this.messageLikes[replyId].push({ emoji, count: 1, userIds: [userId] });
    }
  }

  handleReactionReply(
    reaction: { emoji: string; count: number; userIds: string[] },
    userId: string,
    replyId: string
  ) {
    const alreadyReacted = reaction.userIds.includes(userId);

    if (alreadyReacted) {
      this.removeUserReactionReply(reaction, userId, replyId);
    } else {
      this.addUserReactionReply(reaction, userId);
    }
  }

  private removeUserReactionReply(
    reaction: { emoji: string; count: number; userIds: string[] },
    userId: string,
    replyId: string
  ) {
    reaction.userIds = reaction.userIds.filter((id) => id !== userId);
    reaction.count = Math.max(reaction.count - 1, 0);
    if (reaction.count === 0) {
      reaction.userIds = [];
      this.messageLikes[replyId] = this.messageLikes[replyId].filter(
        (r) => r.emoji !== reaction.emoji
      );
    }
  }

  private addUserReactionReply(
    reaction: { emoji: string; count: number; userIds: string[] },
    userId: string
  ) {
    reaction.userIds.push(userId);
    reaction.count++;
  }

  handleReaction(
    reaction: { emoji: string; count: number; userIds: string[] },
    userId: string,
    messageId: string
  ) {
    const alreadyReacted = reaction.userIds.includes(userId);

    if (alreadyReacted) {
      this.removeUserReactionFromMessage(reaction, userId, messageId);
    } else {
      this.addUserReactionToMessage(reaction, userId);
    }
  }

  private removeUserReactionFromMessage(
    reaction: { emoji: string; count: number; userIds: string[] },
    userId: string,
    messageId: string
  ) {
    reaction.userIds = reaction.userIds.filter((id) => id !== userId);
    reaction.count = Math.max(reaction.count - 1, 0);
    if (reaction.count === 0) {
      reaction.userIds = [];
      this.messageLikes[messageId] = this.messageLikes[messageId].filter(
        (r) => r.emoji !== reaction.emoji
      );
    }
  }

  private addUserReactionToMessage(
    reaction: { emoji: string; count: number; userIds: string[] },
    userId: string
  ) {
    reaction.userIds.push(userId);
    reaction.count++;
  }

  checkReactingUser(
    reactionIndex: number,
    userId: string,
    messageId: string,
    emoji: string
  ) {
    if (reactionIndex !== -1) {
      const reaction = this.messageLikes[messageId][reactionIndex];
      this.handleReaction(reaction, userId, messageId);
    } else {
      this.messageLikes[messageId].push({ emoji, count: 1, userIds: [userId] });
    }
  }
}
