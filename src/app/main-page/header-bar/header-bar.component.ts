import { Component, effect, signal } from '@angular/core';
import { PopupComponent } from '../../popup/popup.component';
import { PopupService } from '../../popup/popup.service';
import { UserService } from '../../shared/services/user.service';
import { GlobalVariablesService } from '../../shared/services/global-variables.service';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ChannelService } from '../../shared/services/channel.service';
import { MainChatService } from '../../shared/services/main-chat.service';
import { SearchChatService } from '../../shared/services/search-chat.service';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-header-bar',
  standalone: true,
  imports: [PopupComponent, CommonModule, ReactiveFormsModule],
  templateUrl: './header-bar.component.html',
  styleUrl: './header-bar.component.scss',
  animations: [
    trigger('dropdownAnimation', [
      state('closed', style({
        height: '0px',
        opacity: 0,
        overflow: 'hidden',
      })),
      state('open', style({
        height: '*',
        opacity: 1,
      })),
      transition('closed => open', [
        animate('300ms ease-out')
      ]),
      transition('open => closed', [
        animate('200ms ease-in')
      ])
    ])
  ]
})
export class HeaderBarComponent {
  filteredChannels: any[] = []
  filteredUserNames: any[] = [];
  public profileMenuPopupOpen: boolean = false;
  public UserName: string = '';
  public userImage: string = '';
  public isMobile: boolean = false;
  searchControl = new FormControl('');
  list: any = '';
  filteredList: any = [];
  isOpen = signal(false);

  constructor(
    private popupService: PopupService,
    public userService: UserService,
    private globalVariablesService: GlobalVariablesService,
    private channelService: ChannelService,
    private mainChatService: MainChatService,
    public searchChatService: SearchChatService
  ) {
    this.searchControl.valueChanges.subscribe((value) =>
      this.applyFilter(value)
    );
    effect(() => {
      const user = this.userService.loggedInUser();
      if (user && user !== undefined && user !== null) {
        console.log('eingeloggter user: ', user);
        this.UserName = user.name;
        this.userImage = user.image;
      } else {
        this.UserName = 'lädt...';
        this.userImage = 'imgs/avatar/profile.svg';
      }
      this.isMobile = this.globalVariablesService.isMobile();
    });
  }



  get showMainChat() {
    return this.mainChatService.showMainChat;
  }

  set showMainChat(value: boolean) {
    this.mainChatService.showMainChat = value;
  }

  get openUserProfilePopup() {
    return this.popupService.openUserProfilePopup;
  }

  set openUserProfilePopup(value: boolean) {
    this.popupService.openUserProfilePopup = value;
  }

  applyFilter(query: string | null) {
    this.searchForUser(query)
    this.searchForChannel(query)
    // If the query doesn't start with "@" but has at least 3 characters, filter by message text
    if (query && query.length >= 3) {
      this.filteredList = this.channelService.allChannels
        .map((channel: any) => {
          // Ensure there are messages to filter
          const messages = Array.isArray(channel.messages) ? channel.messages : [];

          // Filter messages that contain the query (case-insensitive)
          const filteredMessages = messages.filter((msg: any) =>
            msg.message?.toLowerCase().includes(query.toLowerCase())
          );

          // Return the channel with the filtered messages
          return { ...channel, messages: filteredMessages };
        })
        // Remove channels that have no matching messages
        .filter((channel: any) => channel.messages && channel.messages.length > 0);
    } else {
      // Optionally, handle the case where the query is null or less than 3 characters
      this.filteredList = [];
    }
  }

  searchForUser(query: string | null) {
    if (query?.startsWith('@')) {
      if (query.length >= 1) {
        this.isOpen.set(true)
        const usernameQuery = query.slice(1).toLowerCase();
        this.filteredUserNames = this.userService.allUsers.filter((user) => user.name.toLowerCase().includes(usernameQuery.toLowerCase()))
      }
    } else {
      this.filteredUserNames = [];
    }
  }

  searchForChannel(query: string | null) {
    if (query?.startsWith('#')) {
      if (query.length >= 1) {
        const usernameQuery = query.slice(1).toLowerCase();
        this.filteredChannels = this.channelService.allChannels.filter((channel) => channel.name.toLowerCase().includes(usernameQuery.toLowerCase()))
      }
    } else {
      this.filteredChannels = [];
    }
  }

  clearSearch() {
    this.searchControl.setValue('');
  }

  resetChat() {
    this.searchChatService.resetPanelAndChat();
    this.searchChatService.resetChannelChat();
    this.searchChatService.resetSearchChat();
    this.searchChatService.resetDirectChat();
    this.mainChatService.showMainChat = false;
  }

}
