// Checken ob Message oder Reply / DM

/// Im DOM / html Rendern / Synchen

/// Stylen
// Liste
// Component

/// Code aufräumen

import { Injectable } from '@angular/core';
import { UserService } from '../services/user.service';
import { FirebaseService } from './firebase.service';
import { PanelService } from './panel.service';

@Injectable({
  providedIn: 'root',
})
export class EmojiCounterService {
  constructor(
    private userService: UserService,
    private firebaseService: FirebaseService,
    private panelService: PanelService
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
    > = {},
    isReply: boolean,
    replyId: string
  ) {
    /* console.log(
        'emoji',
        emoji,
        'user',
        userId,
        'messageid',
        messageId,
        'channelid',
        channelId,
        'likesarray',
        previousReactions,
      ); */

    if (!isReply) {
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
    } else {
      /*       console.log('reply')
      console.log('emoji',
        emoji,
        'user',
        userId,
        'messageid',
        this.panelService.messageId,
        'channelid',
        channelId,
        'likesarray',
        previousReactions,
      'replyId',
      replyId) */
      this.messageLikes = { ...previousReactions };
      if (!this.messageLikes[replyId]) {
        this.messageLikes[replyId] = [];
      }
      const reactionIndex = this.messageLikes[replyId].findIndex(
        (item) => item.emoji === emoji
      );
      this.checkReactingUserReply(reactionIndex, userId, replyId, emoji);
    }
  }

  checkReactingUserReply(
    reactionIndex: number,
    userId: string,
    replyId: string,
    emoji: string
  ) {
    console.log('AUFGERUFEN')
    if (!this.messageLikes[replyId]) {
      this.messageLikes[replyId] = [];
    }

    if (reactionIndex !== -1) {
      const reaction = this.messageLikes[replyId][reactionIndex];
      this.handleReactionReply(reaction, userId, replyId);
    } else {
      this.messageLikes[replyId].push({ emoji, count: 1, userIds: [userId] });
      console.log(this.messageLikes[replyId], 'LIKES')
    }
  }

  /// Funzt nicht
  handleReactionReply(
    reaction: { emoji: string; count: number; userIds: string[] },
    userId: string,
    replyId: string
  ) {
    console.log('🔹 Vorher (Reply):', JSON.stringify(reaction, null, 2));

    if (!reaction.userIds.includes(userId)) {
      // Falls der Benutzer noch nicht reagiert hat, füge ihn hinzu
      reaction.userIds.push(userId);
      reaction.count++;
      console.log('✅ Hinzugefügt (Reply):', JSON.stringify(reaction, null, 2));
    } else {
      // Falls der Benutzer bereits reagiert hat, entferne ihn
      reaction.userIds = reaction.userIds.filter((id) => id !== userId);
      reaction.count--;

      console.log('❌ Entfernt (Reply):', JSON.stringify(reaction, null, 2));

      // Falls keine Nutzer mehr diese Reaktion haben, entferne sie
      if (reaction.count === 0) {
        console.log('🗑️ Reaktion für Reply entfernt:', reaction.emoji);

        // Sicherstellen, dass `userIds` leer ist
        reaction.userIds = [];

        // Das ganze Reaktionsobjekt aus der Liste entfernen
        this.messageLikes[replyId] = this.messageLikes[replyId].filter(
          (r) => r.emoji !== reaction.emoji
        );
      }
    }

    console.log('📌 Nachher (Reply):', JSON.stringify(reaction, null, 2));
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

  handleReaction(
    reaction: { emoji: string; count: number; userIds: string[] },
    userId: string,
    messageId: string
  ) {
    console.log('🔹 Vorher:', JSON.stringify(reaction, null, 2));

    if (!reaction.userIds.includes(userId)) {
      // Falls der Benutzer noch nicht reagiert hat, füge ihn hinzu
      reaction.userIds.push(userId);
      reaction.count++;
      console.log('✅ Hinzugefügt:', JSON.stringify(reaction, null, 2));
    } else {
      // Falls der Benutzer bereits reagiert hat, entferne ihn
      reaction.userIds = reaction.userIds.filter((id) => id !== userId);
      reaction.count--;

      console.log('❌ Entfernt:', JSON.stringify(reaction, null, 2));

      // Falls keine Nutzer mehr diese Reaktion haben, setze `userIds` auf ein leeres Array
      if (reaction.count === 0) {
        console.log('🗑️ Reaktion komplett entfernt für Emoji:', reaction.emoji);

        // Sicherstellen, dass `userIds` leer ist
        reaction.userIds = [];

        // Das ganze Reaktionsobjekt aus der Liste entfernen
        this.messageLikes[messageId] = this.messageLikes[messageId].filter(
          (r) => r.emoji !== reaction.emoji
        );
      }
    }

    console.log('📌 Nachher:', JSON.stringify(reaction, null, 2));
  }
}
