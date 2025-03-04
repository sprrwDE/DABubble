import { NgIf, NgClass } from '@angular/common';
import { Component, EventEmitter, Output, effect } from '@angular/core';
import { PopupService } from '../popup.service';
import { ChannelService } from '../../shared/services/channel.service';
import { Channel } from '../../shared/models/channel.model';
import { User } from '../../shared/models/user.model';
import { AddMemberPopupComponent } from './add-member-popup/add-member-popup.component';
import { UserService } from '../../shared/services/user.service';
import { GlobalVariablesService } from '../../shared/services/global-variables.service';

@Component({
  selector: 'app-member-list-popup',
  standalone: true,
  imports: [NgIf, NgClass, AddMemberPopupComponent],
  templateUrl: './member-list-popup.component.html',
  styleUrl: './member-list-popup.component.scss',
})
export class MemberListPopupComponent {
  @Output() closePopupEvent = new EventEmitter<void>();

  userList: User[] = [];
  userIds: string[] = [];
  loggedInUser: any;
  currentChannelUsers: User[] = [];
  currentChannel: Channel = new Channel();

  constructor(
    public popupService: PopupService,
    private channelService: ChannelService,
    private userService: UserService,
    public globalVariablesService: GlobalVariablesService
  ) {
    console.log('Popup Service memberListPopup gesetzt:', this);
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
  }

  get allUsers() {
    return this.userService.allUsers;
  }

  get showAddMembersPopup() {
    console.log('Popup wird überprüft. Aktueller Status:', this.popupService.showAddMembersPopup);
    return this.popupService.showAddMembersPopup;
  }  

  set showAddMembersPopup(value: boolean) {
    console.log('showAddMembersPopup wird gesetzt auf:', value, 'Stack:', new Error().stack);
    this.popupService.showAddMembersPopup = value;
  }
  
  get currentChannelId() {
    return this.channelService.currentChannelId;
  }

  closePopup() {
    this.closePopupEvent.emit();
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
