import { CommonModule, NgClass, NgFor } from '@angular/common';
import { Component, effect, EventEmitter, Output } from '@angular/core';
import { UserService } from '../../shared/services/user.service';
import { PopupService } from '../../popup/popup.service';
import { ChannelService } from '../../shared/services/channel.service';
import { Subscription } from 'rxjs';
import { TestService } from '../../shared/services/test.service';
import { User } from '../../shared/models/user.model';
import { Channel } from '../../shared/models/channel.model';

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

  public loggedInUser: any;
  public currentChannel: Channel = new Channel();

  constructor(
    public user: UserService,
    public popupService: PopupService,
    public channelService: ChannelService,
    public userService: UserService,
    public test: TestService
  ) {
    effect(() => {
      this.loggedInUser = this.userService.loggedInUser();
    });

    effect(() => {
      this.currentChannel = this.channelService.currentChannel();
    });
  }

  get allChannels() {
    return this.channelService.allChannels;
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

  setCurrentChannel(channel: Channel) {
    this.channelService.currentChannel.set(channel);

    this.channelService.chatComponent.scroll = true;
  }
}
