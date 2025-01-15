import { NgClass } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { User } from '../../shared/models/user.model';
import { UserService } from '../../shared/services/user.service';
import { PopupService } from '../../popup/popup.service';

@Component({
  selector: 'app-sidebar-nav',
  standalone: true,
  imports: [NgClass],
  providers: [],
  templateUrl: './sidebar-nav.component.html',
  styleUrl: './sidebar-nav.component.scss',
})
export class SidebarNavComponent {
  showChannels = true;
  showContacts = true;
  showUser = false;
  @Output() showUserChange = new EventEmitter<User | null>();
  @Output() openPopupEvent = new EventEmitter<{
    type: string;
    corner: string;
  }>();

  constructor(public user: UserService, public popupService: PopupService) {}

  toggleChannels() {
    this.showChannels = !this.showChannels;
  }

  toggleContacts() {
    this.showContacts = !this.showContacts;
  }

  openDialog(user: User) {
    this.showUserChange.emit(user);
  }

  openPopup(popupType: string, popupCorner: string) {
    this.popupService.showCreateChannelAddPeoplePopup = false;
    this.popupService.showCreateChannelAddPeopleInput = false;
    this.openPopupEvent.emit({ type: popupType, corner: popupCorner });
  }
}
