import { Component, effect, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PopupComponent } from '../../../popup/popup.component';
import { ChannelService } from '../../../shared/services/channel.service';
import { UserService } from '../../../shared/services/user.service';
import { Channel } from '../../../shared/models/channel.model';
import { User } from '../../../shared/models/user.model';
import { PopupService } from '../../../popup/popup.service';
import { DirectChatService } from '../../../shared/direct-chat.service';
import { DirectChat } from '../../../shared/models/direct-chat.model';
import { AuthService } from '../../../shared/services/auth.service';

@Component({
  selector: 'app-chat-header',
  standalone: true,
  imports: [CommonModule, PopupComponent],
  templateUrl: './chat-header.component.html',
  styleUrl: './chat-header.component.scss',
})
export class ChatHeaderComponent {
  currentChannel: Channel = new Channel();
  channelUsers: User[] = [];
  channelDetailsPopupOpen: boolean = false;
  channelDetailsPopupType: string = '';
  channelDetailsPopupCorner: string = '';
  memberListPopupOpen: boolean = false;
  memberListPopupType: string = '';
  memberListPopupCorner: string = '';

  currentDirectChatUser: User = new User();

  @Input() isDirectChat: boolean = false;

  loggedInUser: any;

  constructor(
    private channelService: ChannelService,
    private userService: UserService,
    private popupService: PopupService,
    private directChatService: DirectChatService
  ) {
    effect(() => {
      this.currentChannel = this.channelService.currentChannel();
      this.channelUsers = this.userService.allUsers.filter((user) =>
        this.currentChannel.users?.includes(user.id)
      );
    });

    effect(() => {
      this.currentDirectChatUser =
        this.directChatService.currentDirectChatUser();
    });

    effect(() => {
      this.loggedInUser = this.userService.loggedInUser();
    });
  }

  get contactProfileContent() {
    return this.popupService.contactProfileContent;
  }

  openChannelDetailsPopup(type: string, corner: string) {
    this.channelDetailsPopupType = type;
    this.channelDetailsPopupCorner = corner;
    this.channelDetailsPopupOpen = true;
  }

  closeChannelDetailsPopup() {
    this.channelDetailsPopupOpen = false;
  }

  openMemberListPopup(type: string, corner: string, addMembers: boolean) {
    this.memberListPopupType = type;
    this.memberListPopupCorner = corner;
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
}
