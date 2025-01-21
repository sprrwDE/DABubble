import { Component, EventEmitter, Output } from '@angular/core';
import { PopupService } from '../../popup.service';
import { FormsModule } from '@angular/forms';
import { PopupComponent } from '../../popup.component';
import { AddUserToChannelPopupComponent } from '../../add-user-to-channel-popup/add-user-to-channel-popup.component';

@Component({
  selector: 'app-add-member-popup',
  standalone: true,
  imports: [FormsModule, AddUserToChannelPopupComponent, PopupComponent],
  templateUrl: './add-member-popup.component.html',
  styleUrl: './add-member-popup.component.scss',
})
export class AddMemberPopupComponent {
  @Output() closePopupEvent = new EventEmitter<void>();

  memberName: string = ''; // Variable für den Namen des Mitglieds
  memberImage: string = ''; // Variable für das Bild des Mitglieds
  memberStatus: string = 'offline'; // Status des Mitglieds (online/offline)

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

  get showAddUserToChannelPopup() {
    return this.popupService.addUserToChannelPopup;
  }

  set showAddUserToChannelPopup(value: boolean) {
    this.popupService.addUserToChannelPopup = value;
  }

  showAddUserToChannelSection(event: Event) {
    event.stopPropagation();
    this.popupService.addUserToChannelPopup = true;
    console.log('Popup sollte nun offen sein:', this.popupService.addUserToChannelPopup);
  }
  
}
