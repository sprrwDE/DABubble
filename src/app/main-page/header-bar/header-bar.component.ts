import { Component, OnInit } from '@angular/core';
import { PopupComponent } from '../../popup/popup.component';
import { PopupService } from '../../popup/popup.service';
import { UserService } from '../../shared/services/user.service';

@Component({
  selector: 'app-header-bar',
  standalone: true,
  imports: [PopupComponent],
  templateUrl: './header-bar.component.html',
  styleUrl: './header-bar.component.scss',
})
export class HeaderBarComponent implements OnInit {
  public profileMenuPopupOpen: boolean = false;
  UserName: string = "";

  constructor(private popupService: PopupService, private userService: UserService) {

  }



  ngOnInit(): void {
    this.userService.loggedInUser$.subscribe((user) => {
      if (user) {
        console.log("eingeloggter user: ", user)
        this.UserName = user.name
      }else {
        this.UserName = "lädt..."
      }
    });
  }

  get openUserProfilePopup() {
    return this.popupService.openUserProfilePopup;
  }

  set openUserProfilePopup(value: boolean) {
    this.popupService.openUserProfilePopup = value;
  }
}
