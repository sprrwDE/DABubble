import { Component, effect, EventEmitter, Output, Input } from '@angular/core';
import { CommonModule, NgClass, NgIf } from '@angular/common';
import { PopupService } from '../popup.service';
import { Channel } from '../../shared/models/channel.model';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../shared/services/user.service';
import { Subscription } from 'rxjs';
import { ChannelService } from '../../shared/services/channel.service';
import { AddUserService } from '../../shared/services/add-user.service';
import { GlobalVariablesService } from '../../shared/services/global-variables.service';
import { AddUsersToNewChannelComponent } from './add-users-to-new-channel/add-users-to-new-channel.component';
import { PanelService } from '../../shared/services/panel.service';

@Component({
  selector: 'app-create-channel-popup',
  standalone: true,
  imports: [CommonModule, FormsModule, AddUsersToNewChannelComponent],
  templateUrl: './create-channel-popup.component.html',
  styleUrl: './create-channel-popup.component.scss',
})
export class CreateChannelPopupComponent {
  @Output() closePopupEvent = new EventEmitter<void>();
  @Input() display: boolean = false;
  userIds: string[] = [];

  unsubLoggedInUser!: Subscription;

  showUserPopup: boolean = false;
  nameInput: string = '';

  isMobile: any;
  loggedInUser: any;

  constructor(
    public popupService: PopupService,
    public userService: UserService,
    public channelService: ChannelService,
    public addUserService: AddUserService,
    public globalVariablesService: GlobalVariablesService,
    public panelService: PanelService
  ) {
    effect(() => {
      this.loggedInUser = this.userService.loggedInUser();
    });

    effect(() => {
      this.isMobile = this.globalVariablesService.isMobile();
    });

    this.popupService.channelDetailsPopup = this;
  }

  get channel() {
    return this.popupService.createChannelPopupChannel;
  }

  set channel(value: Channel) {
    this.popupService.createChannelPopupChannel = value;
  }

  get showErrorText() {
    return this.popupService.showCreateChannelPopupErrorText;
  }

  set showErrorText(value: boolean) {
    this.popupService.showCreateChannelPopupErrorText = value;
  }

  get showCreateChannelAddPeoplePopup() {
    return this.popupService.showCreateChannelAddPeoplePopup;
  }

  set showCreateChannelAddPeoplePopup(value: boolean) {
    this.popupService.showCreateChannelAddPeoplePopup = value;
  }

  get showCreateChannelAddPeopleInput() {
    return this.popupService.showCreateChannelAddPeopleInput;
  }

  set showCreateChannelAddPeopleInput(value: boolean) {
    this.popupService.showCreateChannelAddPeopleInput = value;
  }

  get allUsers() {
    return this.userService.allUsers;
  }

  showAddUsersToChannelPopup() {
    if (this.channel.name.trim() !== '') {
      this.showCreateChannelAddPeoplePopup = true;

      if (this.channel.description.trim() === '') {
        this.channel.description = 'No description';
      }
    } else {
      this.showErrorText = true;
    }
  }

  // createChannel() {
  //   if (!this.showCreateChannelAddPeopleInput) {
  //     this.allUsers.forEach((user) => this.channel.users.push(user.id));
  //   } else {
  //     this.addUserService.userToAdd.forEach((user) =>
  //       this.channel.users.push(user.id)
  //     );
  //   }
  //   this.channel.channelCreatorId = this.loggedInUser.id;

  //   this.channelService.addChannel(this.channel.toJSON());

  //   this.panelService.closeReplyPanel();
  //   this.addUserService.userToAdd = [];
  //   this.addUserService.possibleUserList = [];
  //   console.log(this.channel);
  //   this.closePopup();
  // }

  addMemberToNewChannel(event: Event) {
    this.addUserService.isCreatingNewChannel = true;
    this.getNameInput(event);
  }

  getNameInput(event: Event) {
    let name = this.nameInput.trim().toLowerCase();
    this.addUserService.filterArrayForNameInput(name);

    if (this.addUserService.userToAdd.length === 0) {
      this.showUserPopup = true;
      return;
    }

    if (this.nameInput !== '') {
      this.showAddUserToChannelSection(event);
    } else {
      this.showUserPopup = false;
    }
  }

  showAddMembersSection(event: Event) {
    event.stopPropagation();
  }

  set showAddUserToChannelPopup(value: boolean) {
    this.display = value;
  }

  showAddUserToChannelSection(event: Event) {
    event.stopPropagation();
    this.preventClose(event);
    this.addUserService.isCreatingNewChannel = true;
    this.addUserService.filterArrayForNameInput(
      this.nameInput.trim().toLowerCase()
    );

    if (this.addUserService.filteredUsers.length > 0) {
      this.showUserPopup = true;
    } else {
      this.showUserPopup = false;
    }
  }

  preventClose(event: Event) {
    event.stopPropagation();
  }

  closePopup() {
    this.popupService.createChannelPopupOpen = false;
    this.showUserPopup = false;
    this.showCreateChannelAddPeoplePopup = false;

    this.popupService.createChannelPopupChannel = new Channel();
    this.addUserService.userToAdd = [];
  }

  handleUserPopupClose(event: boolean) {
    this.showUserPopup = event;
  }

  handleClearInput() {
    this.nameInput = '';
  }
}
