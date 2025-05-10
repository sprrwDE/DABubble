import { effect, inject, Injectable, OnInit, signal } from '@angular/core';
import { FirebaseService } from '../../shared/services/firebase.service';
import { Channel } from '../models/channel.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { NgZone } from '@angular/core';
import {
  Firestore,
  addDoc,
  collection,
  doc,
  onSnapshot,
  arrayRemove,
  updateDoc,
  deleteDoc,
} from '@angular/fire/firestore';
import { Message } from '../models/message.model';
import { Reply } from '../models/reply.model';
import { ChatComponent } from '../../main-page/chat/chat.component';
import { UserService } from './user.service';
import { MainChatService } from './main-chat.service';

@Injectable({
  providedIn: 'root',
})
export class ChannelService {
  firestore = inject(Firestore);
  allChannels: Channel[] = [];
  currentChannelId: string = '';
  currentChannel = signal<Channel>(new Channel());
  currentChannelMessages: Message[] = [];
  currentChannelIdIsInitialized = false;
  currentReplyMessageId = signal<string>('');
  chatComponent!: ChatComponent;
  loggedInUser: any;

  unsubAllChannels: any;
  unsubMessages: any;

  ngOnDestroy(): void {
    this.unsubAllChannels();
    this.unsubMessages();
  }

  constructor(public fb: FirebaseService, private userService: UserService) {
    effect(() => {
      this.loggedInUser = this.userService.loggedInUser();
    });
    this.getAllChannels();
  }

  getAllChannels() {
    try {
      this.unsubAllChannels = onSnapshot(
        collection(this.firestore, 'channels'),
        (snapshot) => this.handleChannelsSnapshot(snapshot)
      );
    } catch (error) {
      console.error('Error fetching channels:', error);
    }
  }

  private handleChannelsSnapshot(snapshot: any) {
    this.allChannels = [];
    snapshot.forEach((item: any) => this.processChannel(item));
  }

  private processChannel(item: any) {
    const channelData = { ...item.data(), id: item.id, messages: [] };
    const channel = new Channel(channelData);
    this.subscribeToChannelMessages(channel, item.id);
  }

  private subscribeToChannelMessages(channel: Channel, channelId: string) {
    this.unsubMessages = onSnapshot(
      collection(this.firestore, `channels/${channelId}/messages`),
      (snapshot) => this.handleMessagesSnapshot(snapshot, channel, channelId)
    );
  }

  private handleMessagesSnapshot(
    snapshot: any,
    channel: Channel,
    channelId: string
  ) {
    const messages = this.createMessagesFromDocs(snapshot);
    this.setupRepliesSubscriptions(messages, channelId);
    this.updateChannel(channel, messages);
  }

  private createMessagesFromDocs(snapshot: any): Message[] {
    const messages: Message[] = [];
    snapshot.forEach((doc: any) => {
      messages.push(this.createMessageFromDoc(doc));
    });
    return messages;
  }

  private createMessageFromDoc(doc: any): Message {
    return new Message({
      ...doc.data(),
      id: doc.id,
      replies: [],
    });
  }

  private setupRepliesSubscriptions(messages: Message[], channelId: string) {
    messages.forEach((message) => {
      this.subscribeToMessageReplies(channelId, message);
    });
  }

  private subscribeToMessageReplies(channelId: string, message: Message) {
    onSnapshot(
      this.getRepliesCollectionRef(channelId, message.id || ''),
      (snapshot) => this.handleRepliesSnapshot(snapshot, message)
    );
  }

  private getRepliesCollectionRef(channelId: string, messageId: string) {
    return collection(
      this.firestore,
      `channels/${channelId}/messages/${messageId}/replies`
    );
  }

  private handleRepliesSnapshot(snapshot: any, message: Message) {
    message.replies = this.createRepliesFromDocs(snapshot).sort(
      (a, b) => a.timestamp - b.timestamp
    );
    this.updateCurrentChannel(
      this.currentChannel(),
      this.currentChannelMessages
    );
  }

  private createRepliesFromDocs(snapshot: any): Reply[] {
    return snapshot.docs.map(
      (doc: any) => new Reply({ ...doc.data(), id: doc.id })
    );
  }

  private updateChannel(channel: Channel, messages: Message[]) {
    channel.messages = messages.sort((a, b) => a.timestamp - b.timestamp);
    this.updateChannelInList(channel);
    this.updateCurrentChannel(channel, messages);
  }

  private updateChannelInList(channel: Channel) {
    const index = this.allChannels.findIndex((ch) => ch.id === channel.id);
    if (index >= 0) this.allChannels[index] = channel;
    else this.allChannels.push(channel);
  }

  private updateCurrentChannel(channel: Channel, messages: Message[]) {
    if (this.currentChannel().id === channel.id) {
      this.currentChannelMessages = messages;
      this.currentChannel.set(channel);
    }
  }

  async addChannel(data: any) {
    try {
      const docRef = await addDoc(collection(this.firestore, 'channels'), data);
      data.id = docRef.id;
      return data;
    } catch (error) {
      console.error('Fehler beim Erstellen des Channels: ', error);
    }
  }

  async leaveChannel(channelId: string, userId: string) {
    const channelRef = doc(this.firestore, 'channels', channelId);
    await updateDoc(channelRef, {
      users: arrayRemove(userId),
    });
  }

  async deleteChannel(channelId: string) {
    const channelRef = doc(this.firestore, 'channels', channelId);
    await deleteDoc(channelRef);
  }

  async editChannelName(channelId: string, newName: string) {
    const channelRef = doc(this.firestore, 'channels', channelId);
    await updateDoc(channelRef, {
      name: newName,
    });
  }

  async editChannelDescription(channelId: string, newDescription: string) {
    const channelRef = doc(this.firestore, 'channels', channelId);
    await updateDoc(channelRef, {
      description: newDescription,
    });
  }

  async editMessage(messageId: string, newMessage: string) {
    const messageRef = doc(
      this.firestore,
      'channels',
      this.currentChannel().id,
      'messages',
      messageId
    );
    await updateDoc(messageRef, {
      message: newMessage,
    });
  }

  async editReply(messageId: string, replyId: string, newReply: string) {
    const replyRef = doc(
      this.firestore,
      'channels',
      this.currentChannel().id,
      'messages',
      messageId,
      'replies',
      replyId
    );
    await updateDoc(replyRef, {
      message: newReply,
    });
  }

  async sendMessage(data: any) {
    try {
      const channelRef = doc(
        this.firestore,
        'channels',
        this.currentChannel().id
      );
      await addDoc(collection(channelRef, 'messages'), data);
    } catch (error) {
      console.error('Fehler beim Erstellen der Nachricht:', error);
    }
  }

  async sendReply(messageId: string, data: any) {
    try {
      const messageRef = doc(
        this.firestore,
        `channels/${this.currentChannel().id}/messages/${messageId}`
      );
      const replyRef = await addDoc(collection(messageRef, 'replies'), data);
      await updateDoc(replyRef, { id: replyRef.id });
    } catch (error) {
      console.error('Fehler beim Erstellen der Antwort:', error);
    }
  }

  formatDate(timestamp: number): string {
    const date = new Date(timestamp);
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    };
    return date.toLocaleDateString('de-DE', options);
  }

  formatTime(timestamp: number): string {
    const date = new Date(timestamp);
    const options: Intl.DateTimeFormatOptions = {
      hour: '2-digit',
      minute: '2-digit',
    };
    return date.toLocaleTimeString('de-DE', options);
  }

  filterAllChannels() {
    return this.allChannels.filter((channel) =>
      channel.users.includes(this.loggedInUser?.id)
    );
  }
}
