import { CommonModule, NgClass, NgFor } from '@angular/common';
import { Component, effect, EventEmitter, Output } from '@angular/core';
import { User } from '../../shared/models/user.model';
import { UserService } from '../../shared/services/user.service';
import { PopupService } from '../../popup/popup.service';
import { ChannelService } from '../../shared/services/channel.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sidebar-nav',
  standalone: true,
  imports: [CommonModule],
  providers: [],
  templateUrl: './sidebar-nav.component.html',
  styleUrl: './sidebar-nav.component.scss',
})
export class SidebarNavComponent {
  showChannels = true;
  showContacts = true;
  showUser = false;
  @Output() openPopupEvent = new EventEmitter<{
    type: string;
    corner: string;
  }>();
  unsubLoggedInUser!: Subscription;
  private isLoggedInUser = false;

  constructor(
    public user: UserService,
    public popupService: PopupService,
    public channelService: ChannelService,
    public userService: UserService
  ) {
    // effect(() => {
    
    //   const user = this.userService.loggedInUser();
    //   if (user) {
    //     this.channel.channelCreatorId = user.id;
    //     this.isLoggedInUser = user.id === this.userIdToCheck; // userIdToCheck sollte übergeben werden oder als Property definiert sein
    //   }
    // });
  }

  get allChannels() {
    return this.channelService.allChannels;
  }

  get currentChannelId() {
    return this.channelService.currentChannelId;
  }

  set currentChannelId(value: string) {
    this.channelService.currentChannelId = value;
  }

  toggleChannels() {
    this.showChannels = !this.showChannels;
  }

  toggleContacts() {
    this.showContacts = !this.showContacts;
  }

  openPopup(popupType: string, popupCorner: string) {
    this.popupService.showCreateChannelAddPeoplePopup = false;
    this.popupService.showCreateChannelAddPeopleInput = false;
    this.openPopupEvent.emit({ type: popupType, corner: popupCorner });
  }

  checkLoggedInUserId(userId: string): boolean {
    // Hier wird der bereits ermittelte Wert zurückgegeben
    return this.isLoggedInUser;
  }

  ngOnDestroy() {
    if (this.unsubLoggedInUser) {
      this.unsubLoggedInUser.unsubscribe();
    }
  }
}
