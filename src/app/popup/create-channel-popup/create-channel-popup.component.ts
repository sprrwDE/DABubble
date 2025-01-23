import { Component, effect, EventEmitter, Output } from '@angular/core';
import { CommonModule, NgClass, NgIf } from '@angular/common';
import { PopupService } from '../popup.service';
import { Channel } from '../../shared/models/channel.model';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../shared/services/user.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-create-channel-popup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-channel-popup.component.html',
  styleUrl: './create-channel-popup.component.scss',
})
export class CreateChannelPopupComponent {
  @Output() closePopupEvent = new EventEmitter<void>();

  public channel: Channel = new Channel();
  userIds: string[] = [];

  unsubLoggedInUser!: Subscription;

  constructor(
    public popupService: PopupService,
    public userService: UserService
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
  }

  createChannel() {
    if (!this.showCreateChannelAddPeopleInput) {
      this.allUsers.forEach((user) => this.channel.users.push(user.id));
    } else {
      this.userIds.forEach((userId) => this.channel.users.push(userId));
    }

    // this.unsubLoggedInUser = this.userService.loggedInUser$.subscribe(
    //   (user) => {
    //     this.channel.channelCreatorId = user.id;
    //   }
    // );

    console.log(this.channel);
  }

  // ngOnDestroy() {
  //   this.unsubLoggedInUser.unsubscribe();
  // }
}
