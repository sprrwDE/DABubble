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
} from '@angular/fire/firestore';
import { Message } from '../models/message.model';

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
      (snapshot) => this.handleMessagesSnapshot(snapshot, channel)
    );
  }

  private handleMessagesSnapshot(snapshot: any, channel: Channel) {
    const messages = this.createMessages(snapshot);
    this.updateChannel(channel, messages);
  }

  private createMessages(snapshot: any): Message[] {
    const messages: Message[] = [];
    snapshot.forEach((doc: any) => {
      messages.push(new Message(doc.data()));
    });
    return messages;
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
    }
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

  // async sendMessage(data: any) {
  //   try {
  //     const channelRef = doc(this.firestore, 'channels', this.currentChannelId);
  //     await updateDoc(channelRef, {
  //       messages: [data, ...(this.currentChannel?.messages || [])],
  //     });
  //   } catch (error) {
  //     console.error('Fehler beim Erstellen der Nachricht:', error);
  //   }
  // }

  // ///////////////////
  private currentChannelData$ = new BehaviorSubject<Channel | null>(null);
  private unsubscribe?: () => void;
  fetchedChannelData$: Observable<any>;

  // constructor(private fb: FirebaseService) {
  //   this.fetchedChannelData$ = this.fb.fetchedSingleData$;
  // }

  // Hole Daten und speichere sie im BehaviorSubject
  fetchChannel(channelId: string): void {
    if (this.unsubscribe) {
      this.unsubscribe(); // Falls bereits eine Subscription besteht, beende sie.
    }

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
}
