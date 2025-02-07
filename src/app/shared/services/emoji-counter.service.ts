/// Remove Funktion anpassen

/// Bei add / remove direkt firebase
// Channel ID holen - check
// Current Message ID holen - check
// Checken ob Message oder Reply / DM

/// Im DOM / html Rendern / Synchen
// Checken ob bereits geklickt oder nicht -> +1 oder -1

/// Stylen
// Liste
// Component

/// Code aufräumen

import { Injectable } from '@angular/core';
import { UserService } from '../services/user.service';
import { FirebaseService } from './firebase.service';

@Injectable({
  providedIn: 'root',
})
export class EmojiCounterService {
  constructor(
    private userService: UserService,
    private firebaseService: FirebaseService
  ) {}

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
    previousReactions: Record<string,{ emoji: string; count: number; userIds: string[] }[]> = {}) {

    this.messageLikes = { ...previousReactions };
    if (!this.messageLikes[messageId]) {
      this.messageLikes[messageId] = [];
    }
    const reactionIndex = this.messageLikes[messageId].findIndex(
      (item) => item.emoji === emoji
    );
    this.checkReactingUser(reactionIndex, userId, messageId, emoji)
    this.firebaseService.updateEmojiCount(this.messageLikes, messageId,channelId);
  }

  checkReactingUser(reactionIndex: number, userId: string, messageId: string, emoji: string) {
    if (reactionIndex !== -1) {
      const reaction = this.messageLikes[messageId][reactionIndex];
      this.handleReaction(reaction, userId, messageId);
    } else {
      this.messageLikes[messageId].push({ emoji, count: 1, userIds: [userId] });
    }
  }

  handleReaction(
    reaction: { emoji: string; count: number; userIds: string[] },
    userId: string,
    messageId: string
  ): boolean {
    if (!reaction.userIds.includes(userId)) {
      reaction.count++;
      reaction.userIds.push(userId);
      return true; 
    } else {
      reaction.userIds = reaction.userIds.filter((id) => id !== userId);
      reaction.count--;
  
      if (reaction.count === 0) {
        this.messageLikes[messageId] = this.messageLikes[messageId].filter(
          (r) => r.emoji !== reaction.emoji
        );
      }
      return false; 
    }
  }
}
