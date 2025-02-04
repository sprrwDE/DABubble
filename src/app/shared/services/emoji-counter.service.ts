/* import { Injectable } from '@angular/core';
import { UserService } from "../services/user.service";

@Injectable({
  providedIn: 'root',
})
export class EmojiCounterService {
  //// Kann beides weg wenn man in Firebase handled
  clickedEmojis: string[] = [];
  emojiCountArray: { emoji: string; count: number }[] = []; // Array von Objekten

  constructor(private userService: UserService) {}


  addEmoji(emoji: string) {
    this.clickedEmojis.push(emoji);

    const existingEmoji = this.emojiCountArray.find(
      (item) => item.emoji === emoji
    );

    if (existingEmoji) {
      existingEmoji.count++;
    } else {
      this.emojiCountArray.push({ emoji, count: 1});
    }

    console.log('Count:', this.emojiCountArray);
    console.log('Clicked List:', this.clickedEmojis);
  }

  removeEmoji(emoji: string) {
    const index = this.emojiCountArray.findIndex(
      (item) => item.emoji === emoji
    );

    if (index !== -1) {
      this.emojiCountArray[index].count--;

      const clickedIndex = this.clickedEmojis.lastIndexOf(emoji);
      if (clickedIndex !== -1) {
        this.clickedEmojis.splice(clickedIndex, 1);
      }

      if (this.emojiCountArray[index].count === 0) {
        this.emojiCountArray.splice(index, 1);
      }

      console.log('Count:', this.emojiCountArray);
      console.log('Clicked List:', this.clickedEmojis);
    }
  }

  resetList() {
    this.clickedEmojis = [];
    this.emojiCountArray = [];
    console.log('clicked', this.clickedEmojis)
    console.log('arr', this.emojiCountArray)
  }
}
 */

  /// Message Model anpassen, dass es matched mit dem Obj. Arr.

  /// Bei add / remove direkt firebase
      // Channel ID holen - check
      // Current Message ID holen - check
      // Checken ob Message oder Reply / DM

  /// Im DOM / html Rendern / Synchen
      // Checken ob bereits geklickt oder nicht -> +1 oder -1

  /// Stylen
      // Liste
      // Component

import { Injectable } from '@angular/core';
import { UserService } from "../services/user.service";

@Injectable({
  providedIn: 'root',
})
export class EmojiCounterService {
  constructor(private userService: UserService) {}

  private messageLikes: Record<string, { emoji: string; count: number; userIds: string[] }[]> = {};

  addEmoji(emoji: string, messageId: string, userId: string, channelId: string) {
    if (!this.messageLikes[messageId]) {
      this.messageLikes[messageId] = [];
    }

    const reaction = this.messageLikes[messageId].find(item => item.emoji === emoji);

    if (reaction) {
      if (!reaction.userIds.includes(userId)) {
        reaction.count++;
        reaction.userIds.push(userId);
      }
    } else {
      this.messageLikes[messageId].push({ emoji, count: 1, userIds: [userId] });
    }

    console.log(`Likes for message ${messageId}:`, `in channel ${channelId}`, this.messageLikes[messageId]);
  }




  // Emoji entfernen
  removeEmoji(emoji: string, messageId: string, userId: string) {
    const reactions = this.messageLikes[messageId];

    if (reactions) {
      const index = reactions.findIndex(item => item.emoji === emoji);

      if (index !== -1) {
        const reaction = reactions[index];
        reaction.userIds = reaction.userIds.filter(id => id !== userId);
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
