import { Injectable } from '@angular/core';
import { User } from '../shared/models/user.model';
import { CreateChannelPopupComponent } from './create-channel-popup/create-channel-popup.component';

@Injectable({
  providedIn: 'root',
})
export class PopupService {
  editChannelName = false;
  editChannelDescription = false;

  showAddMembersPopup = false;

  showCreateChannelAddPeoplePopup = false;
  showCreateChannelAddPeopleInput = false;

  openUserProfilePopup = false;
  editingUserProfile = false;

  contactProfileContent: User = new User();
  contactProfilePopupOpen = false;

  addUserToChannelPopup = false;

  channelDetailsPopup!: CreateChannelPopupComponent;

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
