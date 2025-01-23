import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { PopupService } from '../../popup.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-member-popup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-member-popup.component.html',
  styleUrl: './add-member-popup.component.scss',
})
export class AddMemberPopupComponent {
  @Output() closePopupEvent = new EventEmitter<void>();

  memberName: string = ''; // Variable für den Namen des Mitglieds
  memberImage: string = ''; // Variable für das Bild des Mitglieds
  memberStatus: string = 'offline'; // Status des Mitglieds (online/offline)

  showAddUserToChannelPopup: boolean = false;

  constructor(public popupService: PopupService) {}

  closePopup() {
    this.closePopupEvent.emit();
  }

  addMember() {
    // Logik zum Hinzufügen des Mitglieds
    console.log(
      'Mitglied hinzugefügt:',
      this.memberName,
      this.memberImage,
      this.memberStatus
    );
    this.closePopup(); // Popup nach dem Hinzufügen schließen
  }

  showAddUserToChannelSection(event: Event) {
    event.stopPropagation();

    this.showAddUserToChannelPopup = !this.showAddUserToChannelPopup;

    console.log('Popup sollte nun offen sein:', this.showAddUserToChannelPopup);
  }
}
