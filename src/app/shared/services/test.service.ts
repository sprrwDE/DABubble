import { Injectable, OnDestroy, OnInit, inject } from '@angular/core';
import {
  Firestore,
  collection,
  onSnapshot,
  query,
  orderBy,
  doc,
  addDoc,
  updateDoc,
  arrayUnion,
} from '@angular/fire/firestore';
import { Channel } from '../models/newmodels/channel.model.new';
import { Message } from '../models/newmodels/message.model.new';
import { User } from '../models/user.model';
import { UserService } from './user.service';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { Observable } from 'rxjs';
import { user } from '@angular/fire/auth';

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
  /// DUMMY
  currentChannelId: string = '';

  currentChannelUserIds: string[] = [];
  currentChannelUsers: User[] = [];




  /// Hier
  private allUsersSubject = new BehaviorSubject<User[]>([]);
  allUsers$ = this.allUsersSubject.asObservable(); // Observable für externe Nutzung
  possibleUserList: User[] = [];
  userToAdd: User[] = [];
  filteredUsers: User[] = []

  private channelUserIdsSubject = new BehaviorSubject<string[]>([]); // Speichert die User-IDs aus dem Channel

  constructor(private userservice: UserService) {
    this.userservice.fetchedCollection$.subscribe((users) => {
      this.allUsersSubject.next(users);
    });

    this.loadChannels();
    if(this.currentChannelId) this.subscribeToChannelById(this.currentChannelId); 

    combineLatest([
      this.userservice.fetchedCollection$,
      this.channelUserIdsSubject,
    ]).subscribe(([allUsers, userIds]) => {
      
      if (!this.currentChannelId) {
        console.log('Kein Channel vorhanden, setze alle Nutzer in possibleUserList.');
        this.possibleUserList = allUsers;
        this.currentChannelUsers = []; // Kein Channel -> keine zugewiesenen User
      } else {
        console.log(`Aktueller Channel: ${this.currentChannelId}`);
        
        this.currentChannelUsers = allUsers.filter((user) =>
          userIds.includes(user.id)
        );
        
        this.possibleUserList = allUsers.filter(
          (user) => !userIds.includes(user.id)
        );
      }
    });
    
  }

  /* 
  
  NEXT STEPS:
 
  input value in andere component übergeben und subscriben
  Aus Sidebar Nav Component Click Handler entfernen

  ...User Detail Synchen


  */

  //// HIER

  /// POSSIBLE USER LIST NACH INPUT FILTERN UND NEUES ARRAY MAPPEN -> setUserToAdd anpassen

  setUserToAdd(userToPush: string) {
    const push: User | undefined = this.filteredUsers.find(
      (user) => user.id === userToPush
    );

    if (push) {
      this.userToAdd.push(push);
      this.preventDuplicate(userToPush)
    } else {
      console.warn(
        `User mit ID ${userToPush} nicht gefunden. Aktuelle PossibleUserList:`,
        this.filteredUsers
      );
    }
  }

  preventDuplicate(userToPush: string) {
    this.filteredUsers = this.filteredUsers.filter(
      (user) => user.id !== userToPush
    );
    this.possibleUserList = this.possibleUserList.filter(
      (user) => user.id !== userToPush
    )
  }

  removeUserToAdd(userToRemove: string) {
    const remove: User | undefined = this.userToAdd.find(
      (user) => user.id === userToRemove
    );
    if (remove) {
      this.userToAdd = this.userToAdd.filter(
        (user) => user.id !== userToRemove
      );
      this.possibleUserList.push(remove);
    } else {
      console.warn(
        `User mit ID ${userToRemove} nicht gefunden. \nAktuelle UserToAdd-Liste:`,
        this.userToAdd
      );
    }
  }

  pushMembersToChannel(channelId: string) {
    const arrayToPush = this.userToAdd.map((user) => user.id); // Extrahiert nur die IDs
    const channelRef = doc(this.firestore, 'channels', channelId);

    updateDoc(channelRef, {
      users: arrayUnion(...arrayToPush), // Fügt alle IDs in die users-Liste hinzu
    })
      .then(() => console.log(`User-IDs ${arrayToPush} hinzugefügt`))
      .catch((error) =>
        console.error('Fehler beim Hinzufügen der User-IDs:', error)
      );

      //// Hier input clearen
  }

  filterArrayForNameInput(name: string) {
    this.filteredUsers = this.possibleUserList.filter(user =>
      user.name.toLowerCase().includes(name.toLowerCase())
    );
    // console.log('Filtered User List', this.filteredUsers)
  }

  //// ENDE

  loadChannels() {
    const channelsRef = collection(this.firestore, 'channels');
    // Dummydata
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

      if(this.currentChannelId) this.subscribeToMessages(this.currentChannelId);
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
/*         if (this.currentChannelUserIds.length > 0) {
          console.log('USERIDS IN CHANNEL:', this.currentChannelUserIds);
        } */

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
