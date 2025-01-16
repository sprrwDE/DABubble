import { Component } from '@angular/core';
import { PopupService } from '../popup.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-user-profile-popup',
  standalone: true,
  imports: [NgIf],
  templateUrl: './user-profile-popup.component.html',
  styleUrl: './user-profile-popup.component.scss',
})
export class UserProfilePopupComponent {
  constructor(private popupService: PopupService) {}

  get editingUserProfile() {
    return this.popupService.editingUserProfile;
  }

  set editingUserProfile(value: boolean) {
    this.popupService.editingUserProfile = value;
  }

  closePopup() {
    this.popupService.openUserProfilePopup = false;
  }
}
