import { Injectable } from '@angular/core';

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

  resetEditStates() {
    this.editChannelName = false;
    this.editChannelDescription = false;
  }
}
