import { Component } from '@angular/core';
import { PopupComponent } from '../../popup/popup.component';
import { PopupService } from '../../popup/popup.service';

@Component({
  selector: 'app-header-bar',
  standalone: true,
  imports: [PopupComponent],
  templateUrl: './header-bar.component.html',
  styleUrl: './header-bar.component.scss',
})
export class HeaderBarComponent {
  public profileMenuPopupOpen: boolean = false;

  constructor(private popupService: PopupService) {}

  get openUserProfilePopup() {
    return this.popupService.openUserProfilePopup;
  }

  set openUserProfilePopup(value: boolean) {
    this.popupService.openUserProfilePopup = value;
  }
}
