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
    // Bestehende Reaktionen laden
    console.log(previousReactions, 'prevvvvvvv')
    this.messageLikes = {...previousReactions};
    console.log(this.messageLikes, 'likes neu')
  
    if (!this.messageLikes[messageId]) {
      this.messageLikes[messageId] = [];
    }
  
    // Prüfen, ob das Emoji bereits vorhanden ist
    const reactionIndex = this.messageLikes[messageId].findIndex(
      (item) => item.emoji === emoji
    );
  
    if (reactionIndex !== -1) {
      const reaction = this.messageLikes[messageId][reactionIndex];
  
      // Prüfen, ob der User bereits reagiert hat
      if (!reaction.userIds.includes(userId)) {
        reaction.count++;
        reaction.userIds.push(userId);
      } else {
        // Falls der User bereits reagiert hat, die Reaktion entfernen
        reaction.userIds = reaction.userIds.filter((id) => id !== userId);
        reaction.count--;
  
        if (reaction.count === 0) {
          this.messageLikes[messageId].splice(reactionIndex, 1);
        }
      }
    } else {
      // Falls die Reaktion noch nicht existiert, hinzufügen
      this.messageLikes[messageId].push({ emoji, count: 1, userIds: [userId] });
    }
  
    // Firebase mit aktualisierten Daten synchronisieren
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
