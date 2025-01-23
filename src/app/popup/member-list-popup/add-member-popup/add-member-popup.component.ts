import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { PopupService } from '../../popup.service';
import { FormsModule } from '@angular/forms';
import { AddUserToChannelPopupComponent } from '../../add-user-to-channel-popup/add-user-to-channel-popup.component';
//// DUMMY
import { TestService } from '../../../shared/services/test.service';
import { CommonModule } from '@angular/common';

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

  constructor(public popupService: PopupService, public test: TestService) {}

  closePopup() {
    this.closePopupEvent.emit();
  }

  /*   addMember() {

    console.log(
      'Mitglied hinzugefügt:',
      this.memberName,
      this.memberImage,
      this.memberStatus
    );
    this.closePopup(); 
  } */

  showAddUserToChannelSection(event: Event) {
    event.stopPropagation();
    this.showUserPopup = true;
  }

  closeUserPopup() {
    this.showUserPopup = false;
  }
}
