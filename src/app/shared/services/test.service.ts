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
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TestService implements OnDestroy {
  private firestore: Firestore = inject(Firestore); // Direkt Firestore injizieren
  allChannels: Channel[] = [];
  messages: Message[] = [];
  private unsubscribeAllChannels: any;
  private unsubscribeChannel: any;
  private unsubscribeMessages: any;
  selectedChannel: Channel | null = null;

  currentChannelUserIds: string[] = [];
  currentChannelUsers: User[] = [];

  /// Hier
  private allUsersSubject = new BehaviorSubject<User[]>([]);
  allUsers$ = this.allUsersSubject.asObservable(); // Observable für externe Nutzung  
  possibleUserList:  User[] = []
  userToAdd: User[] = []

  private channelUserIdsSubject = new BehaviorSubject<string[]>([]); // Speichert die User-IDs aus dem Channel

  constructor(private userservice: UserService, ) {

    this.userservice.fetchedCollection$.subscribe((users) => {  
      this.allUsersSubject.next(users);
      // console.log('ALL USER OBSERVER', this.allUsers$)
    });
  

    console.log('TEST SERVICE INIT - CHANNEL DEVSPACE')
    this.loadChannels();
    this.subscribeToChannelById('kfhSXceP8dnTktHLz8hH'); // Channel-ID festlegen

    combineLatest([this.userservice.fetchedCollection$, this.channelUserIdsSubject]).subscribe(
      ([allUsers, userIds]) => {
        this.currentChannelUsers = allUsers.filter(user => userIds.includes(user.id));
        this.possibleUserList = allUsers.filter(user => !userIds.includes(user.id))
        // if(this.currentChannelUsers.length > 0) {console.log('USER IM CHANNEL:', this.currentChannelUsers);}
        if(this.possibleUserList.length > 0) {console.log('POSSIBLE USER LIST:', this.possibleUserList);}
      }
    );
  }

  /* 
  
  NEXT STEPS:
  In Dom Aus "possibleUserList" einen Loop erschaffen, track index
  (click)="setUserToAdd(possibleUserList[index].id)"
  man soll im input feld user wieder entfernen können 

  in setUserToAdd funktion aufrufen welche userToAdd.forEach(user) user.id in Channel Pusht

  Aus Sidebar Nav Component Click Handler entfernen

  Synchen rxjs

  Außerdem:

  ...User(DU) immer oben anzeigen zb in Sidebar nav
  ...User Detail Synchen


  */


  setUserToAdd(userToPush: string) {
    console.log('POSSIBLE USER LIST (vorher)', this.possibleUserList);
    console.log('USER TO ADD LIST', this.userToAdd);
    console.log('Ausgewählter User:', userToPush);
  
    // User in possibleUserList suchen
    const push: User | undefined = this.possibleUserList.find(user => user.id === userToPush);
  
    if (push) { 
      console.log('ADDED USER:', push);
      this.userToAdd.push(push);
  
      // User aus possibleUserList entfernen
      this.possibleUserList = this.possibleUserList.filter(user => user.id !== userToPush);
  
      // 🔥 Timeout, um sicherzustellen, dass possibleUserList wirklich aktualisiert wurde
      setTimeout(() => {
        console.log('NEW POSSIBLE USERS', this.possibleUserList);
      }, 0);
    } else {
      console.warn(`⚠️ User mit ID ${userToPush} nicht gefunden. \nAktuelle PossibleUserList:`, this.possibleUserList);
    }
  }

  removeUserToAdd(userToRemove: string) {
    console.log('USER TO ADD LIST (vorher)', this.userToAdd);
    console.log('POSSIBLE USER LIST (vorher)', this.possibleUserList);
    console.log('Zu entfernender User:', userToRemove);
  
    // User in userToAdd suchen
    const remove: User | undefined = this.userToAdd.find(user => user.id === userToRemove);
  
    if (remove) { 
      console.log('ENTFERNTER USER:', remove);
  
      // User aus userToAdd entfernen
      this.userToAdd = this.userToAdd.filter(user => user.id !== userToRemove);
  
      // User zurück zu possibleUserList hinzufügen
      this.possibleUserList.push(remove);
  
      // 🔥 Timeout, um sicherzustellen, dass die Listen wirklich aktualisiert wurden
      setTimeout(() => {
        console.log('NEUE USER TO ADD LIST:', this.userToAdd);
        console.log('NEUE POSSIBLE USERS LIST:', this.possibleUserList);
      }, 0);
    } else {
      console.warn(`⚠️ User mit ID ${userToRemove} nicht gefunden. \nAktuelle UserToAdd-Liste:`, this.userToAdd);
    }
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

      // console.log('ALLE CHANNEL:', this.allChannels);

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

      // console.log('NACHRICHTEN IN CHANNEL:', channelId, this.messages);
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
