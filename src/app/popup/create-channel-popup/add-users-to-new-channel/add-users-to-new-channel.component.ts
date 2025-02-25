import { CommonModule } from '@angular/common';
import { Component, effect, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AddUserToChannelPopupComponent } from '../../add-user-to-channel-popup/add-user-to-channel-popup.component';
import { PopupService } from '../../popup.service';
import { UserService } from '../../../shared/services/user.service';
import { GlobalVariablesService } from '../../../shared/services/global-variables.service';
import { AddUserService } from '../../../shared/services/add-user.service';
import { ChannelService } from '../../../shared/services/channel.service';
import { Channel } from '../../../shared/models/channel.model';
import { PanelService } from '../../../shared/services/panel.service';
import { SearchChatService } from '../../../shared/services/search-chat.service';

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
  loggedInUser: any;
  constructor(
    public popupService: PopupService,
    public userService: UserService,
    public channelService: ChannelService,
    public addUserService: AddUserService,
    public globalVariablesService: GlobalVariablesService,
    public panelService: PanelService,
    public searchChatService: SearchChatService
  ) {
    effect(() => {
      this.loggedInUser = this.userService.loggedInUser();
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

  set showAddUserToChannelPopup(value: boolean) {
    this.display = value;
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

  async createChannel() {
    this.populateChannelUsers();
    this.setChannelMetadata();
  
    const data = await this.persistChannel();
  
    this.searchChatService.setCurrentChannel(new Channel(data));
    this.resetUserServices();
    this.resetUI();
  }
  
  private populateChannelUsers() {
    if (!this.showCreateChannelAddPeopleInput) {
      this.allUsers.forEach((user) => this.channel.users.push(user.id));
    } else {
      this.addUserService.userToAdd.forEach((user) => {
        this.channel.users.push(user.id);
      });
      if (!this.channel.users.includes(this.channelService.loggedInUser.id)) {
        this.channel.users.push(this.channelService.loggedInUser.id);
      }
    }
  }
  
  private setChannelMetadata() {
    this.channel.channelCreatorId = this.loggedInUser.id;
    this.channel.timestamp = new Date().getTime();
  }
  
  private async persistChannel() {
    return await this.channelService.addChannel(this.channel.toJSON());
  }
  
  private resetUserServices() {
    this.addUserService.userToAdd = [];
    this.addUserService.possibleUserList = [];
  }
  
  private resetUI() {
    this.panelService.closeReplyPanel();
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
