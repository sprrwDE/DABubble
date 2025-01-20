import { Injectable } from '@angular/core';
import { User } from '../shared/models/user.model';

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

  resetEditStates() {
    this.editChannelName = false;
    this.editChannelDescription = false;
  }
}
