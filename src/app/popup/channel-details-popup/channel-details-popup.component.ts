import { NgClass, NgIf } from '@angular/common';
import { Component, EventEmitter, Output, effect } from '@angular/core';
import { PopupService } from '../popup.service';
import { ChannelService } from '../../shared/services/channel.service';
import { UserService } from '../../shared/services/user.service';
import { Channel } from '../../shared/models/channel.model';
import { GlobalVariablesService } from '../../shared/services/global-variables.service';

@Component({
  selector: 'app-channel-details-popup',
  standalone: true,
  imports: [NgClass, NgIf],
  templateUrl: './channel-details-popup.component.html',
  styleUrl: './channel-details-popup.component.scss',
})
export class ChannelDetailsPopupComponent {
  @Output() closePopupEvent = new EventEmitter<void>();

  currentChannel: Channel = new Channel();
  isMobile: boolean = false;
  constructor(
    public popupService: PopupService,
    public channelService: ChannelService,
    public userService: UserService,
    public globalVariablesService: GlobalVariablesService
  ) {
    // Effect reagiert auf Änderungen des Signals
    effect(() => {
      this.currentChannel = this.channelService.currentChannel();
    });

    effect(() => {
      this.isMobile = this.globalVariablesService.isMobile();
    });
  }

  get editChannelName() {
    return this.popupService.editChannelName;
  }

  set editChannelName(value: boolean) {
    this.popupService.editChannelName = value;
  }

  get editChannelDescription() {
    return this.popupService.editChannelDescription;
  }

  set editChannelDescription(value: boolean) {
    this.popupService.editChannelDescription = value;
  }

  get allUsers() {
    return this.userService.allUsers;
  }

  public getCurrentChannelCreatorName() {
    return this.allUsers.find(
      (user) => user.id === this.currentChannel.channelCreatorId
    )?.name;
  }

  closePopup() {
    this.popupService.resetEditStates();

    this.closePopupEvent.emit();
  }
}
