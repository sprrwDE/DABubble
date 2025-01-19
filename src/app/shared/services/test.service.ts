import { Injectable, OnDestroy, OnInit, inject } from '@angular/core';
import {
  Firestore,
  collection,
  onSnapshot,
  query,
  orderBy,
  doc,
} from '@angular/fire/firestore';
import { Channel } from '../models/newmodels/channel.model.new';
import { Message } from '../models/newmodels/message.model.new';
import { User } from '../models/user.model';
import { UserService } from './user.service';
import { BehaviorSubject, combineLatest } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TestService implements OnInit, OnDestroy {
  private firestore: Firestore = inject(Firestore); // Direkt Firestore injizieren
  allChannels: Channel[] = [];
  messages: Message[] = [];
  private unsubscribeAllChannels: any;
  private unsubscribeChannel: any;
  private unsubscribeMessages: any;
  selectedChannel: Channel | null = null;

  currentChannelUserIds: string[] = [];
  currentChannelUsers: User[] = [];

  private channelUserIdsSubject = new BehaviorSubject<string[]>([]); // Speichert die User-IDs aus dem Channel

  constructor(private userservice: UserService) {
    this.loadChannels();
    this.subscribeToChannelById('kfhSXceP8dnTktHLz8hH'); // Channel-ID festlegen

    // 🔥 Echtzeit-Update: Wenn sich `allUsers` oder `currentChannelUserIds` ändert, aktualisieren wir `currentChannelUsers`
    combineLatest([this.userservice.fetchedCollection$, this.channelUserIdsSubject]).subscribe(
      ([allUsers, userIds]) => {
        this.currentChannelUsers = allUsers.filter(user => userIds.includes(user.id));
        if(this.currentChannelUsers.length > 0) {console.log('USER IM CHANNEL:', this.currentChannelUsers);}
      }
    );
  }

  ngOnInit(): void {
    console.log(this.userservice.allUsers);
  }

  loadChannels() {
    const channelsRef = collection(this.firestore, 'channels');
    // Dummydata
    const currentChannelID = 'kfhSXceP8dnTktHLz8hH';
    this.unsubscribeAllChannels = onSnapshot(channelsRef, (snapshot) => {
      this.allChannels = snapshot.docs.map((doc) => {
        const data = doc.data() as Partial<Channel>;
        return new Channel({
          id: doc.id,
          name: data.name || 'Unbekannt',
          users: data.users ?? [],
        });
      });

      console.log('ALLE CHANNEL:', this.allChannels);

      this.subscribeToMessages(currentChannelID);
    });
  }

  subscribeToChannelById(channelId: string) {
    // console.log(`Lade Channel mit ID: ${channelId}`);

    const channelRef = doc(this.firestore, `channels/${channelId}`);

    this.unsubscribeChannel = onSnapshot(channelRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data() as Partial<Channel>;
        this.selectedChannel = new Channel({
          id: docSnap.id,
          name: data.name || 'Unbekannt',
          users: data.users ?? [],
        });

        this.currentChannelUserIds = this.selectedChannel.users;
        if(this.currentChannelUserIds.length > 0) {console.log('USERIDS IN CHANNEL:', this.currentChannelUserIds);}

        // 🔥 `BehaviorSubject` aktualisieren, damit `combineLatest()` triggert
        this.channelUserIdsSubject.next(this.currentChannelUserIds);
      } else {
        console.warn('Channel nicht gefunden.');
        this.selectedChannel = null;
      }
    });
  }

  subscribeToMessages(channelId: string) {
    if (this.unsubscribeMessages) {
      this.unsubscribeMessages();
    }

    const messagesRef = collection(
      this.firestore,
      `channels/${channelId}/messages`
    );
    const messagesQuery = query(messagesRef, orderBy('timestamp', 'asc'));

    this.unsubscribeMessages = onSnapshot(messagesQuery, (snapshot) => {
      this.messages = snapshot.docs.map((doc) => {
        const data = doc.data() as Partial<Message>;
        return new Message({
          id: doc.id,
          message: data.message || '',
          userId: data.userId || '',
          likes: data.likes ?? 0,
          timestamp: data.timestamp ?? Date.now(),
        });
      });

      console.log('NACHRICHTEN IN CHANNEL:', channelId, this.messages);
    });
  }

  ngOnDestroy(): void {
    if (this.unsubscribeAllChannels) this.unsubscribeAllChannels();
    if (this.unsubscribeMessages) this.unsubscribeMessages();
    if (this.unsubscribeChannel) {
      this.unsubscribeChannel(); 
      // console.log('Listener für Channel entfernt');
    }
  }
}
