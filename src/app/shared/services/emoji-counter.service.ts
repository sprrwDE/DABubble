/// Current Reaction Count holen -> Buggy

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
    this.messageLikes = previousReactions;
    console.log('previous reactions:', this.messageLikes);
    if (!this.messageLikes[messageId]) {
      this.messageLikes[messageId] = [];
    }

    const reaction = this.messageLikes[messageId].find(
      (item) => item.emoji === emoji
    );

    if (reaction) {
      if (!reaction.userIds.includes(userId)) {
        reaction.count++;
        reaction.userIds.push(userId);
      }
    } else {
      this.messageLikes[messageId].push({ emoji, count: 1, userIds: [userId] });
      console.log('user hat bereits geliked');
      // this.removeEmoji()
    }

    console.log(
      `Likes for message ${messageId}:`,
      `in channel ${channelId}`,
      this.messageLikes[messageId]
    );
    this.firebaseService.updateEmojiCount(
      this.messageLikes,
      messageId,
      channelId
    );
  }





  // Emoji entfernen
  removeEmoji(emoji: string, messageId: string, userId: string) {
    const reactions = this.messageLikes[messageId];

    if (reactions) {
      const index = reactions.findIndex((item) => item.emoji === emoji);

      if (index !== -1) {
        const reaction = reactions[index];
        reaction.userIds = reaction.userIds.filter((id) => id !== userId);
        reaction.count = reaction.userIds.length;

        if (reaction.count === 0) {
          reactions.splice(index, 1);
        }

        console.log(`Updated likes for message ${messageId}:`, reactions);
      }
    }
  }

  // Likes für eine Nachricht abrufen
  getLikes(messageId: string) {
    return this.messageLikes[messageId] || [];
  }
}
