import { Injectable } from '@angular/core';
import { User } from '../shared/models/user.model';
import { CreateChannelPopupComponent } from './create-channel-popup/create-channel-popup.component';
import { MemberListPopupComponent } from './member-list-popup/member-list-popup.component';
import { Channel } from '../shared/models/channel.model';
import { MessageInputComponent } from '../main-page/chat/message-input/message-input.component';
import { ChannelDetailsPopupComponent } from './channel-details-popup/channel-details-popup.component';

@Injectable({
  providedIn: 'root',
})
export class PopupService {
  editChannelName = false;
  editChannelDescription = false;
  channelNameInputTooLong: boolean = false;
  channelNameExistsError: boolean = false;

  showAddMembersPopup = false;

  createChannelPopupOpen: boolean = false;

  memberListPopupOpen: boolean = false;
  mobileMemberListPopupOpen: boolean = false;
  showCreateChannelAddPeoplePopup = false;
  showCreateChannelAddPeopleInput = false;
  createChannelPopupChannel: Channel = new Channel();

  openUserProfilePopup = false;
  editingUserProfile = false;
  toggleAvatarSelection = false;

  contactProfileContent: User = new User();
  contactProfilePopupOpen = false;

  profileMenuPopupOpen: boolean = false;

  addUserToChannelPopup = false;

  channelDetailsPopupOpen: boolean = false;

  createChannelPopupComponent!: CreateChannelPopupComponent;
  channelDetailsPopupComponent!: ChannelDetailsPopupComponent;
  memberListPopup!: MemberListPopupComponent;
  messageInputComponent!: MessageInputComponent;

  showCreateChannelPopupErrorText = false;

  closeUserPopup() {
    this.messageInputComponent.showUserPopup = false;
    this.messageInputComponent.allUserIds = [];
  }

  resetEditStates() {
    if (this.createChannelPopupComponent) {
      this.createChannelPopupComponent.channel.name = '';
      this.createChannelPopupComponent.channel.description = '';
      this.createChannelPopupComponent.channel.users = [];
    }

    if (this.channelDetailsPopupComponent) {
      this.channelDetailsPopupComponent.channelNameInput = '';
      this.channelDetailsPopupComponent.channelDescriptionInput = '';
    }

    this.showCreateChannelPopupErrorText = false;

    this.editChannelName = false;
    this.editChannelDescription = false;
    this.editingUserProfile = false;
    this.toggleAvatarSelection = false;
    this.showAddMembersPopup = false;

    this.channelNameInputTooLong = false;
    this.channelNameExistsError = false;
  }
}
