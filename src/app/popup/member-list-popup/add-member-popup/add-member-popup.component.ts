import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { PopupService } from '../../popup.service';
import { FormsModule } from '@angular/forms';
import { AddUserToChannelPopupComponent } from '../../add-user-to-channel-popup/add-user-to-channel-popup.component';
import { AddUserService } from '../../../shared/services/add-user.service';
import { GlobalVariablesService } from '../../../shared/services/global-variables.service';

@Component({
  selector: 'app-add-member-popup',
  standalone: true,
  imports: [FormsModule, AddUserToChannelPopupComponent, CommonModule],
  templateUrl: './add-member-popup.component.html',
  styleUrl: './add-member-popup.component.scss',
})
export class AddMemberPopupComponent {
  @Output() closePopupEvent = new EventEmitter<void>();

  showUserPopup: boolean = false;
  nameInput: string = '';

  constructor(
    public popupService: PopupService,
    public globalVariablesService: GlobalVariablesService,
    public addUserService: AddUserService
  ) {}

  addMembers(id: string) {
    this.addUserService.pushMembersToChannel(id);
    this.clearInputAndClosePopup();
    this.addUserService.userToAdd = [];
  }

  showAddUserToChannelSection(event: Event) {
    event.stopPropagation();
    this.addUserService.isCreatingNewChannel = false;
    if (this.addUserService.userToAdd.length == 0 && this.nameInput == 'Gast')
      return;
    else this.showUserPopup = true;
  }

  closeUserPopup() {
    this.showUserPopup = false;
    this.addUserService.filteredUsers = [];
    this.addUserService.userToAdd = [];
  }

  addMemberToExistingChannel(event: Event) {
    this.addUserService.isCreatingNewChannel = false;
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

  setUser(userId: string) {
    this.addUserService.setUserToAdd(userId);
    this.nameInput = '';
  }

  clearInputAndClosePopup() {
    this.nameInput = '';
    this.showUserPopup = false;
    this.closePopupEvent.emit();
  }

  handleClearInput() {
    this.nameInput = '';
  }

  closePopup() {
    this.closePopupEvent.emit();
    this.addUserService.filteredUsers = [];
    this.addUserService.userToAdd = [];
  }

  handleUserPopupClose(event: boolean) {
    this.showUserPopup = event;
  }
}
