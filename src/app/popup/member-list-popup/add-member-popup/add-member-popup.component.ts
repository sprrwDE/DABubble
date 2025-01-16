import { Component } from '@angular/core';
import { PopupService } from '../../popup.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-member-popup',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './add-member-popup.component.html',
  styleUrl: './add-member-popup.component.scss',
})
export class AddMemberPopupComponent {
  memberName: string = ''; // Variable für den Namen des Mitglieds
  memberImage: string = ''; // Variable für das Bild des Mitglieds
  memberStatus: string = 'offline'; // Status des Mitglieds (online/offline)

  constructor(private popupService: PopupService) {}

  closePopup() {
    this.popupService.showAddMembersPopup = false; // Popup schließen
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
}
