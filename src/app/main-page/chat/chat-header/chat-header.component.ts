import { Component, effect, ElementRef, Input, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PopupComponent } from '../../../popup/popup.component';
import { ChannelService } from '../../../shared/services/channel.service';
import { UserService } from '../../../shared/services/user.service';
import { Channel } from '../../../shared/models/channel.model';
import { User } from '../../../shared/models/user.model';
import { PopupService } from '../../../popup/popup.service';
import { DirectChatService } from '../../../shared/services/direct-chat.service';
import { DirectChat } from '../../../shared/models/direct-chat.model';
import { AuthService } from '../../../shared/services/auth.service';
import { SearchChatService } from '../../../shared/services/search-chat.service';
import { FormsModule } from '@angular/forms';
import { SearchChatPopupComponent } from './search-chat-popup/search-chat-popup.component';
import { GlobalVariablesService } from '../../../shared/services/global-variables.service';
import { AddUserService } from '../../../shared/services/add-user.service';

@Component({
  selector: 'app-chat-header',
  standalone: true,
  imports: [
    CommonModule,
    PopupComponent,
    FormsModule,
    SearchChatPopupComponent,
  ],
  templateUrl: './chat-header.component.html',
  styleUrl: './chat-header.component.scss',
})
export class ChatHeaderComponent {
  currentChannel: Channel = new Channel();
  channelDetailsPopupType: string = '';
  channelDetailsPopupCorner: string = '';
  currentDirectChatUser: User = new User();

  @Input() isDirectChat: boolean = false;

  loggedInUser: any;
  isMobile: boolean = false;
  memberListContainerWidth: boolean = false;

  constructor(
    private channelService: ChannelService,
    public userService: UserService,
    private popupService: PopupService,
    private directChatService: DirectChatService,
    public searchChatService: SearchChatService,
    private globalVariablesService: GlobalVariablesService,
    private addUserService: AddUserService
  ) {
    effect(() => {
      this.currentChannel = this.channelService.currentChannel();
    });

    effect(() => {
      this.currentDirectChatUser =
        this.directChatService.currentDirectChatUser();
    });

    effect(() => {
      this.loggedInUser = this.userService.loggedInUser();
    });

    effect(() => {
      this.isMobile = this.globalVariablesService.isMobile();
    });
  }

  get memberListPopupOpen() {
    return this.popupService.memberListPopupOpen;
  }

  set memberListPopupOpen(value: boolean) {
    this.popupService.memberListPopupOpen = value;
  }

  get contactProfileContent() {
    return this.popupService.contactProfileContent;
  }

  get searchChat() {
    return this.searchChatService.searchChat;
  }

  get channelDetailsPopupOpen() {
    return this.popupService.channelDetailsPopupOpen;
  }

  set channelDetailsPopupOpen(value: boolean) {
    this.popupService.channelDetailsPopupOpen = value;
  }

  openChannelDetailsPopup() {
    this.channelDetailsPopupOpen = true;
  }

  closeChannelDetailsPopup() {
    this.channelDetailsPopupOpen = false;
  }

  openMemberListPopup(addMembers: boolean) {
    this.memberListPopupOpen = true;
    this.popupService.showAddMembersPopup = addMembers;
  }

  closeMemberListPopup() {
    this.memberListPopupOpen = false;
  }

  openProfilePopup() {
    this.popupService.contactProfileContent = this.currentDirectChatUser;

    if (this.loggedInUser.id === this.contactProfileContent.id)
      this.openUserProfilePopup();
    else this.openContactProfilePopup(this.currentDirectChatUser);
  }

  openUserProfilePopup() {
    this.popupService.openUserProfilePopup = true;
    this.popupService.editingUserProfile = false;
  }

  openContactProfilePopup(user: User) {
    this.popupService.contactProfileContent = user;
    this.popupService.contactProfilePopupOpen = true;
  }

  ifChannel(chat: Channel | DirectChat): chat is Channel {
    return chat instanceof Channel;
  }

  ifDirectChat(chat: Channel | DirectChat): chat is DirectChat {
    return chat instanceof DirectChat;
  }

  getUserName(chat: DirectChat): string {
    const user = this.userService.getUserById(chat.userIds[1]);
    return user?.name || 'lädt...';
  }

  getUserImage(chat: DirectChat): string {
    const user = this.userService.getUserById(chat.userIds[1]);
    return user?.image || 'imgs/avatar/profile.svg';
  }

  getUserEmail(chat: DirectChat): string {
    const user = this.userService.getUserById(chat.userIds[1]);
    return user?.email || '';
  }

  showSearchPopup($event: any) {
    $event.stopPropagation();
    this.searchChatService.openSearchPopup = true;
  }
}
