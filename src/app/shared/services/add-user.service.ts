import { Injectable, OnDestroy, inject, effect } from '@angular/core';
import {
  Firestore,
  onSnapshot,
  doc,
  updateDoc,
  arrayUnion,
} from '@angular/fire/firestore';
import { Channel } from '../models/channel.model';
import { User } from '../models/user.model';
import { UserService } from './user.service';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { ChannelService } from './channel.service';

@Injectable({
  providedIn: 'root',
})
export class AddUserService implements OnDestroy {
  private firestore: Firestore = inject(Firestore); 
  private unsubscribeChannel: any;
  selectedChannel: Channel | null = null;

  currentChannelUserIds: string[] = [];
  currentChannelUsers: User[] = [];

  isCreatingNewChannel: boolean = false;

  private allUsersSubject = new BehaviorSubject<User[]>([]);
  allUsers$ = this.allUsersSubject.asObservable(); 

  currentChannel: Channel = new Channel();

  possibleUserList: User[] = [];
  allUsers: User[] = [];
  userToAdd: User[] = [];
  filteredUsers: User[] = [];

  private channelUserIdsSubject = new BehaviorSubject<string[]>([]); 

  constructor(
    private userservice: UserService,
    private channelService: ChannelService
  ) {
    this.userservice.fetchedCollection$.subscribe((users) => {
      this.allUsersSubject.next(users);
    });

    effect(() => {
      this.currentChannel = this.channelService.currentChannel();

      if (this.currentChannel) {
        this.subscribeToChannelById(this.currentChannel.id);
      }
    });

    combineLatest([
      this.userservice.fetchedCollection$,
      this.channelUserIdsSubject,
    ]).subscribe(([allUsers, userIds]) => {
      this.allUsers = allUsers;
      this.currentChannelUsers = []; // Kein Channel -> keine zugewiesenen User

      this.currentChannelUsers = allUsers.filter((user) =>
        userIds.includes(user.id)
      );

      this.possibleUserList = allUsers.filter(
        (user) => !userIds.includes(user.id)
      );
    });
  }

  setUserToAdd(userToPush: string) {
    const push: User | undefined = this.filteredUsers.find(
      (user) => user.id === userToPush
    );

    if (push) {
      this.userToAdd.push(push);
      this.preventDuplicate(userToPush);
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
    );
  }

  removeUserToAdd(userToRemove: string) {
    console.log(this.possibleUserList, 'possible remove start');
    if (!this.isCreatingNewChannel) {
    }
    const remove: User | undefined = this.userToAdd.find(
      (user) => user.id === userToRemove
    );
    if (remove) {
      this.userToAdd = this.userToAdd.filter(
        (user) => user.id !== userToRemove
      );
      this.possibleUserList.push(remove);
      this.filteredUsers = this.possibleUserList;
      console.log(this.possibleUserList, 'possible remove end');
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

  }

  filterArrayForNameInput(name: string) {
    console.log('New Channel?', this.isCreatingNewChannel);
    if (!this.isCreatingNewChannel) {
      this.filteredUsers = this.possibleUserList.filter((user) =>
        user.name.toLowerCase().includes(name.toLowerCase())
      );
      console.log('filtered users', this.filteredUsers)
    } else {
      if(this.userToAdd.length == 0) this.possibleUserList = this.allUsers;
      this.filteredUsers = this.possibleUserList.filter((user) =>
        user.name.toLowerCase().includes(name.toLowerCase())
      );
      console.log('filtered users', this.filteredUsers)
    }
  }

  subscribeToChannelById(channelId: string) {
    console.log(`Lade Channel mit ID: ${channelId}`);

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
        console.log('current channel user ids', this.currentChannelUserIds)

        this.channelUserIdsSubject.next(this.currentChannelUserIds);
      } else {
        console.warn('Channel nicht gefunden.');
        this.selectedChannel = null;
      }
    });
  }

  resetLists() {
    // Setze alle Listen auf den gewünschten Zustand zurück
    this.allUsers = this.allUsersSubject.getValue(); // Holt alle globalen Nutzer
    this.userToAdd = []; // Leere Liste für hinzuzufügende Nutzer
    this.filteredUsers = []; // Leere gefilterte Liste
    
    // Aktualisiere possibleUserList mit allen Nutzern, die noch nicht im aktuellen Channel sind
    this.possibleUserList = this.allUsers.filter(
      (user) => !this.currentChannelUserIds.includes(user.id)
    );
  
    console.log('Listen zurückgesetzt:', {
      allUsers: this.allUsers,
      userToAdd: this.userToAdd,
      filteredUsers: this.filteredUsers,
      possibleUserList: this.possibleUserList,
    });
  }
  
  ngOnDestroy(): void {
    if (this.unsubscribeChannel) {
      this.unsubscribeChannel();
    }
  }
}
