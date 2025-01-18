import { Component } from '@angular/core';
import { PopupService } from '../popup.service';
import { AuthService } from '../../shared/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile-menu-popup',
  standalone: true,
  imports: [],
  templateUrl: './profile-menu-popup.component.html',
  styleUrl: './profile-menu-popup.component.scss',
})
export class ProfileMenuPopupComponent {
  constructor(
    private popupService: PopupService,
    public authService: AuthService,
    public router: Router
  ) {}

  logout() {
    this.router.navigate(['/login']);
  }

  openUserProfilePopup() {
    this.popupService.openUserProfilePopup = true;
    this.popupService.editingUserProfile = false;
  }
}
