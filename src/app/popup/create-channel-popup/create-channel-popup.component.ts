import { Component, effect, EventEmitter, Output, Input } from '@angular/core';
import { CommonModule, NgClass, NgIf } from '@angular/common';
import { PopupService } from '../popup.service';
import { Channel } from '../../shared/models/channel.model';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../shared/services/user.service';
import { Subscription } from 'rxjs';
import { ChannelService } from '../../shared/services/channel.service';
import { AddUserToChannelPopupComponent } from "../add-user-to-channel-popup/add-user-to-channel-popup.component";
import { AddUserService } from '../../shared/services/add-user.service';

@Component({
  selector: 'app-create-channel-popup',
  standalone: true,
  imports: [CommonModule, FormsModule, AddUserToChannelPopupComponent],
  templateUrl: './create-channel-popup.component.html',
  styleUrl: './create-channel-popup.component.scss',
})
export class CreateChannelPopupComponent {
  @Output() closePopupEvent = new EventEmitter<void>();
  @Input() display: boolean = false;
  public channel: Channel = new Channel();
  userIds: string[] = [];

  unsubLoggedInUser!: Subscription;

  showUserPopup: boolean = false;
  nameInput: string = '';

  constructor(
    public popupService: PopupService,
    public userService: UserService,
    public channelService: ChannelService,
    public addUserService: AddUserService
  ) {
    effect(() => {
      const user = this.userService.loggedInUser();
      if (user) {
        this.channel.channelCreatorId = user.id;
      }
    });

    this.popupService.channelDetailsPopup = this;
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

  closePopup() {
    this.closePopupEvent.emit();
    this.showUserPopup = false;
  }

  createChannel() {
    if (!this.showCreateChannelAddPeopleInput) {
      this.allUsers.forEach((user) => this.channel.users.push(user.id));
    } else {
      this.addUserService.userToAdd.forEach((user) => this.channel.users.push(user.id));
    }
    this.channelService.addChannel(this.channel.toJSON());
    this.addUserService.userToAdd = [];
    this.addUserService.possibleUserList = [];
    console.log(this.channel);
    this.closePopup()
  }

  showAddMembersSection(event: Event) {
    event.stopPropagation();
  }

  set showAddUserToChannelPopup(value: boolean) {
    this.display = value; 
  }

  

  showAddUserToChannelSection(event: Event) {
    event.stopPropagation();
    this.addUserService.isCreatingNewChannel = true;
    this.addUserService.filterArrayForNameInput(this.nameInput.trim().toLowerCase());
  
    if (this.addUserService.filteredUsers.length > 0) {
      console.log('Popup wird angezeigt');
      this.showUserPopup = true;
    } else {
      console.log('Popup bleibt versteckt');
      this.showUserPopup = false;
    }
  }
  


  // ngOnDestroy() {
  //   this.unsubLoggedInUser.unsubscribe();
  // }
}
