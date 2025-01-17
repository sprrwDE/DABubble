import { Component } from '@angular/core';
import { SidebarNavComponent } from './sidebar-nav/sidebar-nav.component';
import { ReplyPanelComponent } from './reply-panel/reply-panel.component';
import { ChatComponent } from './chat/chat.component';
import { HeaderBarComponent } from './header-bar/header-bar.component';
import { NgClass, NgIf } from '@angular/common';
import { User } from '../shared/models/user.model';
import { PanelService } from '../shared/services/panel.service';
import { PopupComponent } from '../popup/popup.component';
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
  constructor(public panelService: PanelService) {
    // console.log(user.arr)
  }

  openSidebar = true;

  selectedUser: User = new User();
  public contactProfilePopupOpen = false;

  public popupOpen = false;
  public popupType: string = '';
  public popupCorner: string = '';

  toggleSidebar() {
    this.openSidebar = !this.openSidebar;
  }

  openContactProfile(user: User | any) {
    if (user) {
      this.selectedUser = user;
      this.contactProfilePopupOpen = true;
    }
  }

  openPopup(event: { type: string; corner: string }) {
    this.popupOpen = true;
    this.popupType = event.type;
    this.popupCorner = event.corner;
  }
}
