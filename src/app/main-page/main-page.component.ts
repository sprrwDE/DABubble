import { Component } from '@angular/core';
import { SidebarNavComponent } from './sidebar-nav/sidebar-nav.component';
import { ReplyPanelComponent } from './reply-panel/reply-panel.component';
import { ChatComponent } from './chat/chat.component';
import { HeaderBarComponent } from './header-bar/header-bar.component';
import { NgClass, NgIf } from '@angular/common';
import { SingleUserComponent } from './single-user/single-user.component';
import { User } from '../shared/models/user.model';
import { UserService } from '../shared/services/user.service';
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
    SingleUserComponent,
    PopupComponent,
  ],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.scss',
})
export class MainPageComponent {
  constructor(private user: UserService, public panelService: PanelService) {
    // console.log(user.arr)
  }

  openSidebar = true;
  showUser = false;
  selectedUser: User | null = null;

  public popupOpen = false;
  public popupType: string = '';
  public popupCorner: string = '';
  toggleSidebar() {
    this.openSidebar = !this.openSidebar;
  }

  openUserDetails(user: User | null) {
    if (user) {
      this.selectedUser = user;
      this.showUser = true;
    }
  }

  openPopup(event: { type: string; corner: string }) {
    this.popupOpen = true;
    this.popupType = event.type;
    this.popupCorner = event.corner;
  }
}
