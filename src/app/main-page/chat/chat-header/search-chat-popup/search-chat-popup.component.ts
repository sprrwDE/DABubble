import { Component } from '@angular/core';
import { SearchChatService } from '../../../../shared/services/search-chat.service';
import { UserService } from '../../../../shared/services/user.service';
import { DirectChat } from '../../../../shared/models/direct-chat.model';
import { Channel } from '../../../../shared/models/channel.model';
import { CommonModule } from '@angular/common';
import { User } from '../../../../shared/models/user.model';

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

  ifChannel(chat: Channel | User): chat is Channel {
    return chat instanceof Channel;
  }

  ifUser(chat: Channel | User): chat is User {
    return chat instanceof User;
  }
}
