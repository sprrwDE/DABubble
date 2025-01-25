import { Component, effect } from '@angular/core';
import { PopupComponent } from '../../popup/popup.component';
import { PopupService } from '../../popup/popup.service';
import { UserService } from '../../shared/services/user.service';
import { GlobalVariablesService } from '../../shared/services/global-variables.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header-bar',
  standalone: true,
  imports: [PopupComponent, CommonModule],
  templateUrl: './header-bar.component.html',
  styleUrl: './header-bar.component.scss',
})
export class HeaderBarComponent {
  public profileMenuPopupOpen: boolean = false;
  public UserName: string = '';
  public userImage: string = '';
  public isMobile: boolean = false;

  constructor(
    private popupService: PopupService,
    private userService: UserService,
    private globalVariablesService: GlobalVariablesService
  ) {
    effect(() => {
      const user = this.userService.loggedInUser();
      if (user && user !== undefined && user !== null) {
        console.log('eingeloggter user: ', user);
        this.UserName = user.name;
        this.userImage = user.image;
      } else {
        this.UserName = 'lädt...';
        this.userImage = 'imgs/avatar/profile.svg';
      }
    });

    effect(() => {
      this.isMobile = this.globalVariablesService.isMobile();
    });
  }

  get openUserProfilePopup() {
    return this.popupService.openUserProfilePopup;
  }

  set openUserProfilePopup(value: boolean) {
    this.popupService.openUserProfilePopup = value;
  }
}
