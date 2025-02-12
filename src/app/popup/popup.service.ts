import { Injectable } from '@angular/core';
import { User } from '../shared/models/user.model';
import { CreateChannelPopupComponent } from './create-channel-popup/create-channel-popup.component';
import { MemberListPopupComponent } from './member-list-popup/member-list-popup.component';
import { Channel } from '../shared/models/channel.model';

@Injectable({
  providedIn: 'root',
})
export class PopupService {
  editChannelName = false;
  editChannelDescription = false;

  showAddMembersPopup = false;

  createChannelPopupOpen: boolean = false;

  memberListPopupOpen: boolean = false;
  mobileMemberListPopupOpen: boolean = false;
  showCreateChannelAddPeoplePopup = false;
  showCreateChannelAddPeopleInput = false;
  createChannelPopupChannel: Channel = new Channel();

  openUserProfilePopup = false;
  editingUserProfile = false;

  contactProfileContent: User = new User();
  contactProfilePopupOpen = false;

  profileMenuPopupOpen: boolean = false;

  addUserToChannelPopup = false;

  channelDetailsPopupOpen: boolean = false;

  channelDetailsPopup!: CreateChannelPopupComponent;
  memberListPopup!: MemberListPopupComponent;

  showCreateChannelPopupErrorText = false;

  resetEditStates() {
    if (this.channelDetailsPopup) {
      this.channelDetailsPopup.channel.name = '';
      this.channelDetailsPopup.channel.description = '';
      this.channelDetailsPopup.channel.users = [];
    }

    this.showCreateChannelPopupErrorText = false;

    this.editChannelName = false;
    this.editChannelDescription = false;
  }
}
