import { Component, effect } from '@angular/core';
import { PopupComponent } from '../../popup/popup.component';
import { PopupService } from '../../popup/popup.service';
import { UserService } from '../../shared/services/user.service';
import { GlobalVariablesService } from '../../shared/services/global-variables.service';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ChannelService } from '../../shared/services/channel.service';
import { MainChatService } from '../../shared/services/main-chat.service';
import { SearchChatService } from '../../shared/services/search-chat.service';

@Component({
  selector: 'app-header-bar',
  standalone: true,
  imports: [PopupComponent, CommonModule, ReactiveFormsModule],
  templateUrl: './header-bar.component.html',
  styleUrl: './header-bar.component.scss',
})
export class HeaderBarComponent {
  public profileMenuPopupOpen: boolean = false;
  public UserName: string = '';
  public userImage: string = '';
  public isMobile: boolean = false;
  searchControl = new FormControl('');
  list: any = '';
  // list: string[] = ['Apple', 'Banane', 'Kirsche', 'Mango', 'Melone', 'Pfirsich'];
  filteredList: any = [];

  constructor(
    private popupService: PopupService,
    private userService: UserService,
    private globalVariablesService: GlobalVariablesService,
    private channelService: ChannelService,
    private mainChatService: MainChatService,
    private searchChatService: SearchChatService
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
    if (query && query.length >= 3) {
      if (!query) {
        // Zeige alle Channels mit allen Nachrichten
        this.filteredList = this.channelService.allChannels.map(
          (channel: any) => ({
            ...channel,
            messages: [...channel.messages], // Alle Nachrichten beibehalten
          })
        );
        return;
      }

      this.filteredList = this.channelService.allChannels
        .map((channel: any) => {
          if (!channel.messages || !Array.isArray(channel.messages)) {
            return { ...channel, messages: [] }; // Falls keine Nachrichten existieren, leeres Array
          }

          // Filtere die Nachrichten innerhalb des Channels
          const filteredMessages = channel.messages.filter((msg: any) =>
            msg.message?.toLowerCase().includes(query.toLowerCase())
          );

          return { ...channel, messages: filteredMessages }; // Channel bleibt, nur Messages gefiltert
        })
        .filter((channel) => channel.messages.length > 0); // Entferne Channels, die keine passenden Nachrichten haben
      // console.log("Gefilterte Liste:", this.filteredList);
    } else {
      this.filteredList = '';
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
