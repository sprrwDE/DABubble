import { CommonModule } from '@angular/common';
import { Component, effect, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AddUserToChannelPopupComponent } from '../../add-user-to-channel-popup/add-user-to-channel-popup.component';
import { PopupService } from '../../popup.service';
import { UserService } from '../../../shared/services/user.service';
import { GlobalVariablesService } from '../../../shared/services/global-variables.service';
import { AddUserService } from '../../../shared/services/add-user.service';
import { ChannelService } from '../../../shared/services/channel.service';
import { Subscription } from 'rxjs';
import { Channel } from '../../../shared/models/channel.model';
import { loggedIn } from '@angular/fire/auth-guard';

@Component({
  selector: 'app-add-users-to-new-channel',
  standalone: true,
  imports: [CommonModule, FormsModule, AddUserToChannelPopupComponent],
  templateUrl: './add-users-to-new-channel.component.html',
  styleUrl: './add-users-to-new-channel.component.scss',
})
export class AddUsersToNewChannelComponent {
  userIds: string[] = [];

  @Output() closePopupEvent = new EventEmitter<void>();
  @Input() display: boolean = false;

  showUserPopup: boolean = false;
  nameInput: string = '';

  isMobile: any;

  constructor(
    public popupService: PopupService,
    public userService: UserService,
    public channelService: ChannelService,
    public addUserService: AddUserService,
    public globalVariablesService: GlobalVariablesService
  ) {
    effect(() => {
      const user = this.userService.loggedInUser();

      if (user) {
        this.channel.channelCreatorId = user.id;
      }
    });

    effect(() => {
      this.isMobile = this.globalVariablesService.isMobile();
    });
  }

  get channel() {
    return this.popupService.createChannelPopupChannel;
  }

  set channel(value: Channel) {
    this.popupService.createChannelPopupChannel = value;
  }

  get allUsers() {
    return this.userService.allUsers;
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

  createChannel() {
    if (!this.showCreateChannelAddPeopleInput) {
      this.allUsers.forEach((user) => this.channel.users.push(user.id));
    } else {
      this.addUserService.userToAdd.forEach((user) =>
        this.channel.users.push(user.id)
      );
      if(!this.channel.users.includes(this.channelService.loggedInUser.id)) {
        this.channel.users.push(this.channelService.loggedInUser.id)
      }
    }
    this.channelService.addChannel(this.channel.toJSON());
    this.addUserService.userToAdd = [];
    this.addUserService.possibleUserList = [];
    console.log(this.channel, 'channnn');

    this.popupService.createChannelPopupOpen = false;
    this.popupService.createChannelPopupChannel = new Channel();
    this.closePopup();
  }

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
    this.showCreateChannelAddPeoplePopup = false;
  }

  handleUserPopupClose(event: boolean) {
    this.showUserPopup = event;
  }

  handleClearInput() {
    this.nameInput = '';
  }
}
