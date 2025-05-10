import { Component } from '@angular/core';
import { SearchChatService } from '../../../../shared/services/search-chat.service';
import { UserService } from '../../../../shared/services/user.service';
import { Channel } from '../../../../shared/models/channel.model';
import { CommonModule } from '@angular/common';
import { User } from '../../../../shared/models/user.model';
import { GlobalVariablesService } from '../../../../shared/services/global-variables.service';

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
    public userService: UserService,
    public globalVariablesService: GlobalVariablesService
  ) {}

  ifChannel(chat: Channel | User): chat is Channel {
    return chat instanceof Channel;
  }

  ifUser(chat: Channel | User): chat is User {
    return chat instanceof User;
  }
}
