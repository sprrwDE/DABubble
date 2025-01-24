import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { PopupService } from '../../popup.service';
import { FormsModule } from '@angular/forms';
import { AddUserToChannelPopupComponent } from '../../add-user-to-channel-popup/add-user-to-channel-popup.component';
//// DUMMY
import { TestService } from '../../../shared/services/test.service';
import { User } from '../../../shared/models/user.model';

@Component({
  selector: 'app-add-member-popup',
  standalone: true,
  imports: [FormsModule, AddUserToChannelPopupComponent, CommonModule],
  templateUrl: './add-member-popup.component.html',
  styleUrl: './add-member-popup.component.scss',
})
export class AddMemberPopupComponent {
  @Output() closePopupEvent = new EventEmitter<void>();

  /*   memberName: string = ''; // Variable für den Namen des Mitglieds
  memberImage: string = ''; // Variable für das Bild des Mitglieds
  memberStatus: string = 'offline'; // Status des Mitglieds (online/offline) */

  showUserPopup: boolean = false;
  nameInput: string = '';

  constructor(public popupService: PopupService, public test: TestService) {}

  addMembers(id: string) {
    this.test.pushMembersToChannel(id);
    this.closePopup();
  }

  showAddUserToChannelSection(event: Event) {
    event.stopPropagation();
    this.showUserPopup = true;
  }

  closeUserPopup() {
    this.showUserPopup = false;
  }

  getNameInput(event: Event) {
    let name = this.nameInput
    this.test.filterArrayForNameInput(name)
    if(this.nameInput != '') {
      this.showAddUserToChannelSection(event);
    } else {
      this.showUserPopup = false;
    }
  }

  setUser(userId: string) {
    this.test.setUserToAdd(userId);
    this.nameInput = ''; 
  }

  clearInputAndClosePopup() {
    this.nameInput = ''; 
    this.showUserPopup = false; 
    this.closePopupEvent.emit();
  }

  closePopup() {
    this.closePopupEvent.emit();
  }

 }
