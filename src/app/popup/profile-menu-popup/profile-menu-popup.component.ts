import { Component } from '@angular/core';
import { PopupService } from '../popup.service';

@Component({
  selector: 'app-profile-menu-popup',
  standalone: true,
  imports: [],
  templateUrl: './profile-menu-popup.component.html',
  styleUrl: './profile-menu-popup.component.scss',
})
export class ProfileMenuPopupComponent {
  constructor(private popupService: PopupService) {}

  openUserProfilePopup() {
    this.popupService.openUserProfilePopup = true;
  }
}
