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
    previousReactions: Record<string, { emoji: string; count: number; userIds: string[] }[]> = {},
    isReply: boolean,
    replyId: string,
    prevRevReactions: Record<string, { emoji: string; count: number; userIds: string[] }[]> = {},
    isDirectChat: boolean
  ) {
      if (!isReply) {
        // Falls wir noch keine Reaktionen für diese Message haben, initialisiere sie aus previousReactions oder als leeres Array
        if (!this.messageLikes[messageId]) {
          this.messageLikes[messageId] = previousReactions[messageId] ? [...previousReactions[messageId]] : [];
        }
        const reactionIndex = this.messageLikes[messageId].findIndex(
          (item) => item.emoji === emoji
        );
        this.checkReactingUser(reactionIndex, userId, messageId, emoji);
        if(!isDirectChat) {
        this.firebaseService.updateEmojiCount(
          this.messageLikes,
          messageId,
          channelId,
          'channels'
        );} 
        else {
          this.firebaseService.updateEmojiCount(
            this.messageLikes,
            messageId,
            channelId,
            'direct-chats'
          );} 
    } 
       else {
        // Für Replies: Verwende den vorhandenen Zustand für diesen replyId, falls vorhanden, ansonsten initialisiere mit den übergebenen prevRevReactions
        if (!this.messageLikes[replyId]) {
          this.messageLikes[replyId] = prevRevReactions[replyId] ? [...prevRevReactions[replyId]] : [];
        }
        const reactionIndex = this.messageLikes[replyId].findIndex(
          (item) => item.emoji === emoji
        );
        console.log('Aktueller Zustand für replyId', replyId, ':', this.messageLikes[replyId]);
        this.checkReactingUserReply(reactionIndex, userId, replyId, emoji);
        if(!isDirectChat) {
        this.firebaseService.updateEmojiCountReplys(
          this.messageLikes,
          messageId,
          channelId,
          replyId,
          'chats'
        );} 
        else {
          this.firebaseService.updateEmojiCount(
            this.messageLikes,
            messageId,
            replyId,
            'direct-chats'
          );}
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

  handleReactionReply(
    reaction: { emoji: string; count: number; userIds: string[] },
    userId: string,
    replyId: string
  ) {
    console.log('🔹 Vorher (Reply):', JSON.stringify(reaction, null, 2));
  
    // Prüfe, ob der Benutzer bereits reagiert hat
    const alreadyReacted = reaction.userIds.includes(userId);
  
    if (alreadyReacted) {
      // Benutzer hat bereits reagiert – also Like entfernen
      reaction.userIds = reaction.userIds.filter(id => id !== userId);
      reaction.count = Math.max(reaction.count - 1, 0);
      console.log('❌ Entfernt (Reply):', JSON.stringify(reaction, null, 2));
  
      // Falls keine Nutzer mehr diesen Like haben, entferne das gesamte Reaktionsobjekt
      if (reaction.count === 0) {
        console.log('🗑️ Reaktion für Reply entfernt:', reaction.emoji);
        reaction.userIds = [];
        this.messageLikes[replyId] = this.messageLikes[replyId].filter(
          (r) => r.emoji !== reaction.emoji
        );
      }
    } else {
      // Benutzer hat noch nicht reagiert – Like hinzufügen
      reaction.userIds.push(userId);
      reaction.count++;
      console.log('✅ Hinzugefügt (Reply):', JSON.stringify(reaction, null, 2));
    }
  
    console.log('📌 Nachher (Reply):', JSON.stringify(reaction, null, 2));
  }
  
  handleReaction(
    reaction: { emoji: string; count: number; userIds: string[] },
    userId: string,
    messageId: string
  ) {
    console.log('🔹 Vorher:', JSON.stringify(reaction, null, 2));
  
    // Prüfe, ob der Benutzer bereits reagiert hat
    const alreadyReacted = reaction.userIds.includes(userId);
  
    if (alreadyReacted) {
      // Benutzer hat bereits reagiert – Like entfernen
      reaction.userIds = reaction.userIds.filter(id => id !== userId);
      reaction.count = Math.max(reaction.count - 1, 0);
      console.log('❌ Entfernt:', JSON.stringify(reaction, null, 2));
  
      // Falls keine Nutzer mehr diesen Like haben, entferne das Reaktionsobjekt
      if (reaction.count === 0) {
        console.log('🗑️ Reaktion komplett entfernt für Emoji:', reaction.emoji);
        reaction.userIds = [];
        this.messageLikes[messageId] = this.messageLikes[messageId].filter(
          (r) => r.emoji !== reaction.emoji
        );
      }
    } else {
      // Benutzer hat noch nicht reagiert – Like hinzufügen
      reaction.userIds.push(userId);
      reaction.count++;
      console.log('✅ Hinzugefügt:', JSON.stringify(reaction, null, 2));
    }
  
    console.log('📌 Nachher:', JSON.stringify(reaction, null, 2));
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
