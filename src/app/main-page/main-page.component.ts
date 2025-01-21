import { Component, effect, HostListener } from '@angular/core';
import { SidebarNavComponent } from './sidebar-nav/sidebar-nav.component';
import { ReplyPanelComponent } from './reply-panel/reply-panel.component';
import { ChatComponent } from './chat/chat.component';
import { HeaderBarComponent } from './header-bar/header-bar.component';
import { NgClass, NgIf } from '@angular/common';
import { User } from '../shared/models/user.model';
import { PanelService } from '../shared/services/panel.service';
import { PopupComponent } from '../popup/popup.component';
import { PopupService } from '../popup/popup.service';
import { UserService } from '../shared/services/user.service';
import { FirebaseService } from '../shared/services/firebase.service';
@Component({
  selector: 'app-main-page',
  standalone: true,
  imports: [
    SidebarNavComponent,
    ReplyPanelComponent,
    ChatComponent,
    HeaderBarComponent,
    NgClass,
    NgIf,

    PopupComponent,
  ],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.scss',
})
export class MainPageComponent {
  afkDelay: number = 3000;
  timeoutId: any;
  loggedInUser: any;

  constructor(
    public panelService: PanelService,
    public popupService: PopupService,
    private userService: UserService,
    private fb: FirebaseService
  ) {
    effect(() => {
      this.loggedInUser = this.userService.loggedInUser();
    })

  }

  // @HostListener('mousemove', ['$event'])
  // afkMode() {
  //   this.updateUserStatus('online');
  //   clearTimeout(this.timeoutId);
  //   this.timeoutId = setTimeout(() => {
  //     this.updateUserStatus('abwesend');
  //   }, this.afkDelay);
  // }

  // updateUserStatus(status: string) {
  //   this.userService.loggedInUser$.subscribe((user) => {
  //     if (user && user.id) {
  //       this.fb.updateStateUser(user.id, status);
  //     }
  //   });
  // }

  openSidebar = true;

  selectedUser: User = new User();

  public popupOpen = false;
  public popupType: string = '';
  public popupCorner: string = '';

  get contactProfilePopupOpen() {
    return this.popupService.contactProfilePopupOpen;
  }

  set contactProfilePopupOpen(value: boolean) {
    this.popupService.contactProfilePopupOpen = value;
  }

  toggleSidebar() {
    this.openSidebar = !this.openSidebar;
  }

  openPopup(event: { type: string; corner: string }) {
    this.popupOpen = true;
    this.popupType = event.type;
    this.popupCorner = event.corner;
  }
}
