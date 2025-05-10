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

  loggedInUserData: User = new User();

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
    } else return;
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
    } else return;
  }

  pushMembersToChannel(channelId: string) {
    const arrayToPush = this.userToAdd.map((user) => user.id);
    const channelRef = doc(this.firestore, 'channels', channelId);

    updateDoc(channelRef, {
      users: arrayUnion(...arrayToPush),
    }).catch((error) =>
      console.error('Fehler beim Hinzufügen der User', error)
    );
  }

  filterArrayForNameInput(name: string) {
    if (!this.isCreatingNewChannel) {
      this.filteredUsers = this.possibleUserList.filter((user) =>
        user.name.toLowerCase().includes(name.toLowerCase())
      );
    } else {
      if (this.userToAdd.length == 0) this.possibleUserList = this.allUsers;
      this.filteredUsers = this.possibleUserList.filter((user) =>
        user.name.toLowerCase().includes(name.toLowerCase())
      );
    }
  }

  subscribeToChannelById(channelId: string) {
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
        this.channelUserIdsSubject.next(this.currentChannelUserIds);
      } else {
        this.selectedChannel = null;
      }
    });
  }

  resetLists() {
    this.allUsers = this.allUsersSubject.getValue();
    this.userToAdd = [];
    this.filteredUsers = [];
    this.possibleUserList = this.allUsers.filter(
      (user) => !this.currentChannelUserIds.includes(user.id)
    );
  }

  ngOnDestroy(): void {
    if (this.unsubscribeChannel) {
      this.unsubscribeChannel();
    }
  }
}
