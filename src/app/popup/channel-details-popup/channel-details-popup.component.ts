import { CommonModule, NgClass, NgIf } from '@angular/common';
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
    // Effect reagiert auf Änderungen des Signals
    effect(() => {
      this.currentChannel = this.channelService.currentChannel();

      console.log(this.currentChannel);
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

  editChannelNameFunction() {
    if (this.channelNameInput !== '') {
      console.log(this.channelNameInput);

      this.channelService.editChannelName(
        this.currentChannel.id,
        this.channelNameInput
      );

      this.editChannelName = false;

      this.channelNameInput = '';
    } else {
      this.editChannelName = false;
    }
  }

  editChannelDescriptionFunction() {
    if (this.channelDescriptionInput !== '') {
      console.log(this.channelDescriptionInput);

      this.channelService.editChannelDescription(
        this.currentChannel.id,
        this.channelDescriptionInput
      );

      this.editChannelDescription = false;

      this.channelDescriptionInput = '';
    } else {
      this.editChannelDescription = false;
    }
  }

  leaveChannel(event: Event) {
    event.stopPropagation();
    this.closePopup();

    if (this.currentChannel.users.length === 1) {
      this.channelService.deleteChannel(this.currentChannel.id);
    } else {
      this.channelService.leaveChannel(
        this.currentChannel.id,
        this.loggedInUser.id
      );
    }

    this.searchChatService.setSearchChat();
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
