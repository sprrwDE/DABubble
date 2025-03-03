import { Component, effect } from '@angular/core';
import { PopupService } from '../popup.service';
import { Router } from '@angular/router';
import { ChannelService } from '../../shared/services/channel.service';
import { DirectChatService } from '../../shared/services/direct-chat.service';
import { Channel } from '../../shared/models/channel.model';
import { User } from '../../shared/models/user.model';
import { CommonModule } from '@angular/common';
import { GlobalVariablesService } from '../../shared/services/global-variables.service';
import { SearchChatService } from '../../shared/services/search-chat.service';

@Component({
  selector: 'app-profile-menu-popup',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile-menu-popup.component.html',
  styleUrl: './profile-menu-popup.component.scss',
})
export class ProfileMenuPopupComponent {
  isMobile: any;

  constructor(
    private popupService: PopupService,
    public router: Router,
    public directChatService: DirectChatService,
    public channelService: ChannelService,
    public globalService: GlobalVariablesService,
    public searchChatService: SearchChatService
  ) {
    effect(() => {
      this.isMobile = this.globalService.isMobile();
    });
  }

  logout() {
    this.directChatService.currentDirectChatUser.set(new User());
    this.channelService.currentChannel.set(new Channel());

    this.directChatService.isDirectChat = false;

    this.searchChatService.resetPanelAndChat();
    this.searchChatService.resetChannelChat();
    this.searchChatService.resetSearchChat();
    this.searchChatService.resetDirectChat();

    this.searchChatService.searchChat = true;

    this.popupService.profileMenuPopupOpen = false;

    this.router.navigate(['/login']);
  }

  openUserProfilePopup() {
    this.popupService.openUserProfilePopup = true;
    this.popupService.editingUserProfile = false;
  }
}
