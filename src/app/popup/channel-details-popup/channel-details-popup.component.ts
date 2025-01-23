import { NgClass, NgIf } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { PopupService } from '../popup.service';
import { ChannelService } from '../../shared/services/channel.service';
import { UserService } from '../../shared/services/user.service';

@Component({
  selector: 'app-channel-details-popup',
  standalone: true,
  imports: [NgClass, NgIf],
  templateUrl: './channel-details-popup.component.html',
  styleUrl: './channel-details-popup.component.scss',
})
export class ChannelDetailsPopupComponent {
  @Output() closePopupEvent = new EventEmitter<void>();

  constructor(
    public popupService: PopupService,
    public channelService: ChannelService,
    public userService: UserService
  ) {}

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

  get currentChannel() {
    return this.channelService.currentChannel;
  }

  get currentChannelCreatedId() {
    return this.channelService.currentChannel.channelCreatorId;
  }

  get allUsers() {
    return this.userService.allUsers;
  }

  public getCurrentChannelCreatorName() {
    console.log(this.currentChannelCreatedId);

    return this.allUsers.find(
      (user) => user.id === this.currentChannelCreatedId
    )?.name;
  }

  closePopup() {
    this.popupService.resetEditStates();

    this.closePopupEvent.emit();
  }
}
