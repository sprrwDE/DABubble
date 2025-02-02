import { Component } from '@angular/core';
import { SearchChatService } from '../../../../shared/services/search-chat.service';
import { UserService } from '../../../../shared/services/user.service';
import { DirectChat } from '../../../../shared/models/direct-chat.model';
import { Channel } from '../../../../shared/models/channel.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-search-chat-popup',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './search-chat-popup.component.html',
  styleUrl: './search-chat-popup.component.scss',
})
export class SearchChatPopupComponent {
  constructor(
    public searchChatService: SearchChatService,
    public userService: UserService
  ) {}

  ifChannel(chat: Channel | DirectChat): chat is Channel {
    return chat instanceof Channel;
  }

  ifDirectChat(chat: Channel | DirectChat): chat is DirectChat {
    return chat instanceof DirectChat;
  }

  getUserName(chat: DirectChat): string {
    const user = this.userService.getUserById(chat.userIds[1]);
    return user?.name || 'lädt...';
  }

  getUserImage(chat: DirectChat): string {
    const user = this.userService.getUserById(chat.userIds[1]);
    return user?.image || 'imgs/avatar/profile.svg';
  }

  getUserEmail(chat: DirectChat): string {
    const user = this.userService.getUserById(chat.userIds[1]);
    return user?.email || '';
  }
}
