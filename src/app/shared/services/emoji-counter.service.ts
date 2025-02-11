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
    previousReactions: Record<
      string,
      { emoji: string; count: number; userIds: string[] }[]
    > = {}
  ) {
    console.log(
      'emoji',
      emoji,
      'user',
      userId,
      'messageid',
      messageId,
      'channelid',
      channelId,
      'likesarray',
      previousReactions
    );
    this.messageLikes = { ...previousReactions };
    if (!this.messageLikes[messageId]) {
      this.messageLikes[messageId] = [];
    }
    const reactionIndex = this.messageLikes[messageId].findIndex(
      (item) => item.emoji === emoji
    );

    this.checkReactingUser(reactionIndex, userId, messageId, emoji);

    this.firebaseService.updateEmojiCount(
      this.messageLikes,
      messageId,
      channelId
    );
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

  ///// Hier bug

  handleReaction(
    reaction: { emoji: string; count: number; userIds: string[] },
    userId: string,
    messageId: string
  ): boolean {
    console.log('Vorher:', reaction);

    if (!reaction.userIds.includes(userId)) {
      // Falls die UserID noch nicht vorhanden ist, fügen wir sie hinzu
      reaction.count++;
      reaction.userIds.push(userId);
      console.log('Nach Hinzufügen:', reaction);
      return true;
    } else {
      // Falls die UserID vorhanden ist, entfernen wir sie
      reaction.userIds = reaction.userIds.filter((id) => id !== userId);
      reaction.count--;

      console.log('Nach Entfernen:', reaction);

      // Falls keine Reaktionen mehr da sind, entfernen wir das ganze Reaction-Objekt
      if (reaction.count === 0) {
        if (this.messageLikes[messageId]) {
          this.messageLikes[messageId] = this.messageLikes[messageId].filter(
            (r) => r.emoji !== reaction.emoji
          );
        }
      }

      return false;
    }
  }
}
