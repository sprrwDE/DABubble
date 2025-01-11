import { Component } from '@angular/core';
import { SidebarNavComponent } from './sidebar-nav/sidebar-nav.component';
import { ReplyPanelComponent } from './reply-panel/reply-panel.component';
import { ChatComponent } from './chat/chat.component';
import { HeaderBarComponent } from './header-bar/header-bar.component';
import { NgClass, NgIf } from '@angular/common';
import { SingleUserComponent } from './single-user/single-user.component';
import { User } from '../shared/models/user.model';
import { UserService } from '../shared/services/user.service';

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
],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.scss',
})
export class MainPageComponent {
  constructor(private user: UserService) {
    // console.log(user.arr)
  }

  openSidebar = true;
  showUser = false;
  selectedUser: User | null = null;

  toggleSidebar() {
    this.openSidebar = !this.openSidebar;
  }

  openUserDetails(user: User | null) {
    if (user) {
      this.selectedUser = user;
      this.showUser = true;
    }
  }

}
