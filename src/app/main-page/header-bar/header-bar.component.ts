import { Component, effect, Inject, Renderer2, signal } from '@angular/core';
import { PopupComponent } from '../../popup/popup.component';
import { PopupService } from '../../popup/popup.service';
import { UserService } from '../../shared/services/user.service';
import { GlobalVariablesService } from '../../shared/services/global-variables.service';
import { CommonModule, DOCUMENT } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ChannelService } from '../../shared/services/channel.service';
import { MainChatService } from '../../shared/services/main-chat.service';
import { SearchChatService } from '../../shared/services/search-chat.service';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import { collectionSnapshots } from '@angular/fire/firestore';

@Component({
  selector: 'app-header-bar',
  standalone: true,
  imports: [PopupComponent, CommonModule, ReactiveFormsModule],
  templateUrl: './header-bar.component.html',
  styleUrl: './header-bar.component.scss',
  animations: [
    trigger('dropdownAnimation', [
      state(
        'closed',
        style({
          height: '0px',
          opacity: 0,
          overflow: 'hidden',
        })
      ),
      state(
        'open',
        style({
          height: '*',
          opacity: 1,
        })
      ),
      transition('closed => open', [animate('300ms ease-out')]),
      transition('open => closed', [animate('200ms ease-in')]),
    ]),
  ],
})
export class HeaderBarComponent {
  filteredChannels: any[] = [];
  filteredUserNames: any[] = [];
  filteredList: any = [];
  public UserName: string = '';
  public userImage: string = '';
  public isMobile: boolean = false;
  searchControl = new FormControl('');
  list: any = '';
  isOpen = signal(false);
  searchInput: any;
  isSearching: boolean = false;
  noMessage: boolean = false;

  constructor(
    private popupService: PopupService,
    public userService: UserService,
    public globalVariablesService: GlobalVariablesService,
    private channelService: ChannelService,
    private mainChatService: MainChatService,
    public searchChatService: SearchChatService,
    private renderer: Renderer2, @Inject(DOCUMENT) private document: Document
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

  get profileMenuPopupOpen() {
    return this.popupService.profileMenuPopupOpen;
  }

  set profileMenuPopupOpen(value: boolean) {
    this.popupService.profileMenuPopupOpen = value;
  }

  scrollToMessage(message: any, messageId: any, chanel: any) {
    this.isSearching = true
    chanel.messages.filter((eachMessage: any) => {
      if (eachMessage.message.toLowerCase() == message.toLowerCase()) {
        setTimeout(() => {
          const element = this.document.querySelector(`[data-message-id="${messageId}"]`);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }
          this.isSearching = false
        }, 500); // Warten, bis der Kanal geladen ist

      }
    })
  }

  applyFilter(query: string | null) {
    this.searchForUser(query);
    this.searchForChannel(query);

    // Stelle sicher, dass keine Nachricht angezeigt wird, wenn weniger als 3 Zeichen eingegeben wurden
    if (!query || query.length < 3) {
      this.filteredList = [];
      this.noMessage = false;  // Nachricht ausblenden
      return;  // Beende die Funktion sofort
    }

    // Standardmäßig setzen wir die Nachricht auf "keine Ergebnisse"
    this.noMessage = true;

    this.filteredList = this.channelService.allChannels
      .map((channel: any) => {
        const messages = Array.isArray(channel.messages) ? channel.messages : [];

        // Filtere Nachrichten, die den Suchbegriff enthalten
        const filteredMessages = messages.filter((msg: any) =>
          msg.message?.toLowerCase().includes(query.toLowerCase())
        );

        return { ...channel, messages: filteredMessages };
      })
      .filter((channel: any) => channel.messages && channel.messages.length > 0);

    // Falls es Treffer gibt, setzen wir noMessage auf false
    if (this.filteredList.length > 0) {
      this.noMessage = false;
    }
  }


  searchForUser(query: string | null) {
    if (query?.startsWith('@')) {
      if (query.length >= 1) {
        this.isOpen.set(true);
        const usernameQuery = query.slice(1).toLowerCase();
        this.filteredUserNames = this.userService.allUsers.filter((user) =>
          user.name.toLowerCase().includes(usernameQuery.toLowerCase())
        );
      }
    } else {
      this.filteredUserNames = [];
    }
  }

  searchForChannel(query: string | null) {
    if (query?.startsWith('#')) {
      if (query.length >= 1) {
        const usernameQuery = query.slice(1).toLowerCase();
        this.filteredChannels = this.channelService.allChannels.filter(
          (channel) =>
            channel.name.toLowerCase().includes(usernameQuery.toLowerCase())
        );
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
