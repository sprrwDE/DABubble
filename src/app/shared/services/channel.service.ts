import { inject, Injectable } from '@angular/core';
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
  updateDoc,
  getDocs,
} from '@angular/fire/firestore';
import { Message } from '../models/message.model';
import { Reply } from '../models/reply.model';
import { ChatComponent } from '../../main-page/chat/chat.component';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
@Injectable({
  providedIn: 'root',
})
export class ChannelService {
  firestore = inject(Firestore);
  unsubAllChannels: any;
  unsubMessages: any;

  allChannels: Channel[] = [];
  currentChannelId: string = '';
  currentChannel: Channel = new Channel();
  currentChannelMessages: Message[] = [];

  currentChannelIdIsInitialized = false;

  currentChannelUserIds: string[] = [];
  currentChannelUsers: User[] = [];
  private channelUserIdsSubject = new BehaviorSubject<string[]>([]); // Speichert die User-IDs aus dem Channel

  currentReplyMessageId: string = '';

  chatComponent!: ChatComponent;

  ngOnDestroy(): void {
    this.unsubAllChannels();
    this.unsubMessages();
  }

  constructor(
    public fb: FirebaseService,
    private ngZone: NgZone // public firestore: Firestore
  ) {
    this.fetchedChannelData$ = this.fb.fetchedSingleData$;
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
    message.replies = this.createRepliesFromDocs(snapshot);
    this.updateCurrentChannel(this.currentChannel, this.currentChannelMessages);
  }

  private createRepliesFromDocs(snapshot: any): Reply[] {
    return snapshot.docs.map((doc: any) => new Reply(doc.data()));
  }

  private updateChannel(channel: Channel, messages: Message[]) {
    channel.messages = messages.sort((a, b) => a.timestamp - b.timestamp);
    this.updateChannelInList(channel);
    this.updateCurrentChannel(channel, messages);
  }

  private updateChannelInList(channel: Channel) {
    const index = this.allChannels.findIndex((ch) => ch.id === channel.id);
    if (index >= 0) {
      this.allChannels[index] = channel;
    } else {
      this.allChannels.push(channel);
    }
  }

  private updateCurrentChannel(channel: Channel, messages: Message[]) {
    this.initializeCurrentChannelIfNeeded();

    if (this.currentChannelId === channel.id) {
      this.currentChannelMessages = messages;
      this.currentChannel = channel;
      /// wird sehr oft aufgerufen alles
      // console.log('currentChannel', this.currentChannel.id, this.currentChannel)
    }

    this.chatComponent.scrollToBottom();
  }

  private initializeCurrentChannelIfNeeded() {
    if (!this.currentChannelIdIsInitialized && this.allChannels.length > 0) {
      this.currentChannelId = this.allChannels[0].id;
      this.currentChannelIdIsInitialized = true;
    }
  }

  async addChannel(data: any) {
    try {
      const docRef = await addDoc(collection(this.firestore, 'channels'), data);
    } catch (error) {
      console.error('Fehler beim Erstellen des Benutzers: ', error);
    }
  }

  async sendMessage(data: any) {
    try {
      const channelRef = doc(this.firestore, 'channels', this.currentChannelId);
      await addDoc(collection(channelRef, 'messages'), data);
    } catch (error) {
      console.error('Fehler beim Erstellen der Nachricht:', error);
    }
  }

  async sendReply(messageId: string, data: any) {
    try {
      const messageRef = doc(
        this.firestore,
        `channels/${this.currentChannelId}/messages/${messageId}`
      );
      await addDoc(collection(messageRef, 'replies'), data);
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

  /// Ist das alt?
  // Glaube schon
  // ///////////////////
  public currentChannelData$ = new BehaviorSubject<Channel | null>(null);
  private unsubscribe?: () => void;
  fetchedChannelData$: Observable<any>;

  // constructor(private fb: FirebaseService) {
  //   this.fetchedChannelData$ = this.fb.fetchedSingleData$;
  // }

  // Holt Daten und speichere sie im BehaviorSubject
  fetchChannel(channelId: string): void {
    if (this.unsubscribe) {
      this.unsubscribe();
    }

    // Ruft Funktion im Firebase Service auf
    this.unsubscribe = this.fb.subscribeToSingleDoc(
      'channels',
      channelId,
      (data) => {
        this.ngZone.run(() => {
          this.currentChannelData$.next(new Channel(data));
        });
      }
    );
  }

  getChannel(): Observable<Channel | null> {
    return this.currentChannelData$.asObservable();
  }

  unsubscribeChannel(): void {
    if (this.unsubscribe) {
      this.unsubscribe();
      this.unsubscribe = undefined;
    }
  }

  //// Subscribed einen channel onsnapshot -> für memberlist popup

  subscribeToChannelById(channelId: string) {
    // console.log(`Lade Channel mit ID: ${channelId}`);

    const channelRef = doc(this.firestore, `channels/${channelId}`);

    this.unsubscribeChannel = onSnapshot(channelRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data() as Partial<Channel>;
        this.currentChannel = new Channel({
          id: docSnap.id,
          name: data.name || 'Unbekannt',
          users: data.users ?? [],
        });

        this.currentChannelUserIds = this.currentChannel.users;
        if (this.currentChannelUserIds.length > 0) {
          console.log('USERIDS IN CHANNEL:', this.currentChannelUserIds);
        }

        // 🔥 `BehaviorSubject` aktualisieren, damit `combineLatest()` triggert
        this.channelUserIdsSubject.next(this.currentChannelUserIds);
      } else {
        console.warn('Channel nicht gefunden.');
      }
    });
  }
}
