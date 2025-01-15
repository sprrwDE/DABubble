import { Component } from '@angular/core';
import { PopupService } from '../popup.service';

@Component({
  selector: 'app-user-profile-popup',
  standalone: true,
  imports: [],
  templateUrl: './user-profile-popup.component.html',
  styleUrl: './user-profile-popup.component.scss',
})
export class UserProfilePopupComponent {
  constructor(private popupService: PopupService) {}

  closePopup() {
    this.popupService.openUserProfilePopup = false;
  }
}
