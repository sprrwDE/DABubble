import { NgIf, NgClass } from '@angular/common';
import {
  Component,
  EventEmitter,
  Output,
  OnInit,
  OnDestroy,
  effect,
} from '@angular/core';
import { PopupService } from '../popup.service';
import { ChannelService } from '../../shared/services/channel.service';
import { Channel } from '../../shared/models/channel.model';
import { User } from '../../shared/models/user.model';
import { BehaviorSubject, Subscription, combineLatest } from 'rxjs';
import { AddMemberPopupComponent } from './add-member-popup/add-member-popup.component';
import { UserService } from '../../shared/services/user.service';

@Component({
  selector: 'app-member-list-popup',
  standalone: true,
  imports: [NgIf, NgClass, AddMemberPopupComponent],
  templateUrl: './member-list-popup.component.html',
  styleUrl: './member-list-popup.component.scss',
})
export class MemberListPopupComponent implements OnInit, OnDestroy {
  @Output() closePopupEvent = new EventEmitter<void>();

  // channelData$: BehaviorSubject<Channel | null>;
  // private subscription!: Subscription;
  userList: User[] = [];
  userIds: string[] = [];
  loggedInUser: any;
  currentChannelUsers: User[] = [];
  currentChannel: Channel = new Channel();

  constructor(
    public popupService: PopupService,
    private channelService: ChannelService,
    private userService: UserService
  ) {
    this.popupService.memberListPopup = this;
    effect(() => {
      this.loggedInUser = this.userService.loggedInUser();
    });

    effect(() => {
      this.currentChannel = this.channelService.currentChannel();
      this.userList = this.allUsers.filter((user) =>
        this.currentChannel.users.includes(user.id)
      );
    });

    // this.channelData$ = channelService.currentChannelData$;
  }

  get allUsers() {
    return this.userService.allUsers;
  }

  get showAddMembersPopup() {
    return this.popupService.showAddMembersPopup;
  }

  set showAddMembersPopup(value: boolean) {
    this.popupService.showAddMembersPopup = value;
  }

  get currentChannelId() {
    return this.channelService.currentChannelId;
  }

  ngOnInit() {
    //   this.subscription = combineLatest([
    //     this.userService.fetchedCollection$,
    //     this.channelData$,
    //   ]).subscribe(([allUsers, channel]) => {
    //     if (channel) {
    //       this.userIds = channel.users;
    // this.userList = allUsers.filter((user) =>
    //   this.userIds.includes(user.id)
    // );
    //       console.log('USER IM CHANNEL:', this.currentChannelUsers);
    //     }
    //   });
    //   this.channelService.fetchChannel(this.currentChannelId);
  }

  ngOnDestroy() {
    // this.subscription.unsubscribe();
    // this.channelService.unsubscribeChannel();
  }

  closePopup() {
    this.closePopupEvent.emit();
    // this.showAddMembersPopup = false;
  }

  showAddMembersSection(event: Event) {
    event.stopPropagation();
    this.showAddMembersPopup = true;
  }

  openProfilePopup(user: User) {
    this.popupService.contactProfileContent = user;

    if (this.loggedInUser.id === user.id) this.openUserProfilePopup();
    else this.openContactProfilePopup(user);
  }

  openUserProfilePopup() {
    this.popupService.openUserProfilePopup = true;
    this.popupService.editingUserProfile = false;
  }

  openContactProfilePopup(user: User) {
    this.popupService.contactProfileContent = user;
    this.popupService.contactProfilePopupOpen = true;
  }
}
