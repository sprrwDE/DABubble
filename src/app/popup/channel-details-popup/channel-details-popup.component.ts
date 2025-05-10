import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, effect } from '@angular/core';
import { PopupService } from '../popup.service';
import { ChannelService } from '../../shared/services/channel.service';
import { UserService } from '../../shared/services/user.service';
import { Channel } from '../../shared/models/channel.model';
import { GlobalVariablesService } from '../../shared/services/global-variables.service';
import { User } from '../../shared/models/user.model';
import { SearchChatService } from '../../shared/services/search-chat.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-channel-details-popup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './channel-details-popup.component.html',
  styleUrl: './channel-details-popup.component.scss',
})
export class ChannelDetailsPopupComponent {
  @Output() closePopupEvent = new EventEmitter<void>();

  currentChannel: Channel = new Channel();
  loggedInUser: any;
  isMobile: boolean = false;
  isTablet: boolean = false;

  channelNameInput: string = '';
  channelDescriptionInput: string = '';

  constructor(
    public popupService: PopupService,
    public channelService: ChannelService,
    public userService: UserService,
    public globalVariablesService: GlobalVariablesService,
    public searchChatService: SearchChatService
  ) {
    this.popupService.channelDetailsPopupComponent = this;

    effect(() => {
      this.currentChannel = this.channelService.currentChannel();
    });

    effect(() => {
      this.isMobile = this.globalVariablesService.isMobile();
    });

    effect(() => {
      this.isTablet = this.globalVariablesService.isTablet();
    });

    effect(() => {
      this.loggedInUser = this.userService.loggedInUser();
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

  get channelNameInputTooLong() {
    return this.popupService.channelNameInputTooLong;
  }

  get channelNameExistsError() {
    return this.popupService.channelNameExistsError;
  }

  set channelNameInputTooLong(value: boolean) {
    this.popupService.channelNameInputTooLong = value;
  }

  set channelNameExistsError(value: boolean) {
    this.popupService.channelNameExistsError = value;
  }

  editChannelNameFunction(): void {
    if (!this.isValidChannelNameChange()) {
      this.resetChannelNameState();
      return;
    }

    if (this.isChannelNameTooLong()) {
      this.setChannelNameTooLongError();
      return;
    }

    if (this.channelNameExists()) {
      this.setChannelNameExistsError();
      return;
    }

    this.updateChannelName();
    this.resetChannelNameState();
  }

  private isValidChannelNameChange(): boolean {
    return (
      this.channelNameInput.trim() !== '' &&
      this.channelNameInput.trim() !== this.currentChannel.name.trim()
    );
  }

  private setChannelNameTooLongError(): void {
    this.channelNameInputTooLong = true;
    this.channelNameExistsError = false;
  }

  private setChannelNameExistsError(): void {
    this.channelNameInputTooLong = false;
    this.channelNameExistsError = true;
  }

  private updateChannelName(): void {
    this.channelService.editChannelName(
      this.currentChannel.id,
      this.channelNameInput
    );
  }

  private resetChannelNameState(): void {
    this.channelNameInput = '';
    this.editChannelName = false;
    this.channelNameExistsError = false;
    this.channelNameInputTooLong = false;
  }

  private channelNameExists(): boolean {
    return this.channelService.allChannels.some(
      (channel) =>
        channel.name.trim().toLowerCase() ===
        this.channelNameInput.trim().toLowerCase()
    );
  }

  private isChannelNameTooLong(): boolean {
    return this.channelNameInput.trim().length > 20;
  }

  editChannelDescriptionFunction() {
    if (this.channelDescriptionInput.trim() !== '') {
      this.channelService.editChannelDescription(
        this.currentChannel.id,
        this.channelDescriptionInput
      );

      this.editChannelDescription = false;

      this.channelDescriptionInput = '';
    } else this.editChannelDescription = false;
  }

  leaveChannel(event: Event) {
    event.stopPropagation();
    this.closePopup();

    if (this.currentChannel.users.length === 1)
      this.channelService.deleteChannel(this.currentChannel.id);
    else
      this.channelService.leaveChannel(
        this.currentChannel.id,
        this.loggedInUser.id
      );

    this.searchChatService.setSearchChat();
  }

  public getCurrentChannelCreatorName() {
    return this.allUsers.find(
      (user) => user.id === this.currentChannel.channelCreatorId
    )?.name;
  }

  closePopup() {
    this.popupService.resetEditStates();
    this.resetChannelNameState();
    this.closePopupEvent.emit();
  }

  openProfilePopup(user: User) {
    this.popupService.contactProfileContent = user;

    if (this.loggedInUser.id === user.id) this.openUserProfilePopup();
    else this.openContactProfilePopup(user);

    this.closePopup();
  }

  openUserProfilePopup() {
    this.popupService.openUserProfilePopup = true;
    this.popupService.editingUserProfile = false;
  }

  openContactProfilePopup(user: User) {
    this.popupService.contactProfileContent = user;
    this.popupService.contactProfilePopupOpen = true;
  }

  openMemberListPopup() {
    this.popupService.mobileMemberListPopupOpen = true;
    this.popupService.showAddMembersPopup = true;
  }
}
