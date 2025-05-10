import {
  Component,
  effect,
  EventEmitter,
  Output,
  Input,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { PopupService } from '../popup.service';
import { Channel } from '../../shared/models/channel.model';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../shared/services/user.service';
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

  showUserPopup: boolean = false;
  nameInput: string = '';

  isMobile: any;
  loggedInUser: any;

  noNameErrorText: boolean = true;
  nameInputTooLong: boolean = false;

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

    this.popupService.createChannelPopupComponent = this;
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

  set showAddUserToChannelPopup(value: boolean) {
    this.display = value;
  }

  get allUsers() {
    return this.userService.allUsers;
  }

  get allChannels() {
    return this.channelService.allChannels;
  }

  showAddUsersToChannelPopup(): void {
    if (this.isChannelNameEmpty()) {
      this.showErrorText = true;
      this.noNameErrorText = true;
      this.nameInputTooLong = false;

      return;
    }

    if (this.isChannelNameTooLong()) {
      this.showErrorText = true;
      this.noNameErrorText = true;
      this.nameInputTooLong = true;
      return;
    }

    if (this.doesChannelNameExist()) {
      this.showErrorText = true;
      this.noNameErrorText = false;
      this.nameInputTooLong = false;
      return;
    }

    this.showCreateChannelAddPeoplePopup = true;
    this.showErrorText = false;
    this.setDefaultDescription();
  }

  private isChannelNameEmpty(): boolean {
    return this.channel.name.trim() === '';
  }

  private doesChannelNameExist(): boolean {
    return this.allChannels.some(
      (channel) =>
        channel.name.trim().toLowerCase() ===
        this.channel.name.trim().toLowerCase()
    );
  }

  private isChannelNameTooLong(): boolean {
    return this.channel.name.trim().length > 20;
  }

  private setDefaultDescription(): void {
    if (this.channel.description.trim() === '')
      this.channel.description = 'No description';
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

    if (this.nameInput !== '') this.showAddUserToChannelSection(event);
    else this.popupService.closeUserPopup();
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

    if (this.addUserService.filteredUsers.length > 0) this.showUserPopup = true;
    else this.popupService.closeUserPopup();
  }

  preventClose(event: Event) {
    event.stopPropagation();
  }

  closePopup() {
    this.popupService.createChannelPopupOpen = false;
    this.showUserPopup = false;
    this.showCreateChannelAddPeoplePopup = false;
    this.showErrorText = false;

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
