import { Component } from '@angular/core';
import { PopupService } from '../popup.service';
import { AuthService } from '../../shared/services/auth.service';
import { Router } from '@angular/router';
import { ChannelService } from '../../shared/services/channel.service';
import { DirectChatService } from '../../shared/direct-chat.service';
import { Channel } from '../../shared/models/channel.model';
import { User } from '../../shared/models/user.model';

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
    public router: Router,
    public directChatService: DirectChatService,
    public channelService: ChannelService
  ) {}

  logout() {
    this.directChatService.currentDirectChatUser.set(new User());
    this.channelService.currentChannel.set(new Channel());
    this.directChatService.isDirectChat = false;

    this.router.navigate(['/login']);
  }

  openUserProfilePopup() {
    this.popupService.openUserProfilePopup = true;
    this.popupService.editingUserProfile = false;
  }
}
