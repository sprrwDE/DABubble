import { Component, effect, Inject, signal } from '@angular/core';
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
  public UserName: string = '';
  public userImage: string = '';
  public isMobile: boolean = false;

  filteredChannels: any[] = [];
  filteredUserNames: any[] = [];
  filteredList: any[] = [];
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
    @Inject(DOCUMENT) private document: Document
  ) {
    this.searchControl.valueChanges.subscribe((value) =>
      this.applyFilter(value)
    );
    effect(() => {
      const user = this.userService.loggedInUser();
      if (user && user !== undefined && user !== null) {
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

  scrollToMessage(message: string, messageId: string, channel: any): void {
    this.isSearching = true;
    this.findAndScrollToMessageInChannel(message, messageId, channel);
  }

  /**
   * Sucht eine Nachricht im Kanal und scrollt zu ihr
   */
  private findAndScrollToMessageInChannel(
    message: string,
    messageId: string,
    channel: any
  ): void {
    channel.messages.filter((eachMessage: any) => {
      if (eachMessage.message.toLowerCase() === message.toLowerCase())
        this.scrollToMessageWithDelay(messageId);
    });
  }

  /**
   * Scrollt mit Verzögerung zu einer Nachricht, um sicherzustellen, dass der Kanal geladen ist
   */
  private scrollToMessageWithDelay(messageId: string): void {
    setTimeout(() => {
      this.scrollToElementById(messageId);
      this.isSearching = false;
    }, 500); // Warten, bis der Kanal geladen ist
  }

  /**
   * Scrollt zu einem Element mit der angegebenen Message-ID
   */
  private scrollToElementById(messageId: string): void {
    const element = this.document.querySelector(
      `[data-message-id="${messageId}"]`
    );
    if (element)
      element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  /**
   * Hauptfunktion für die Filterung der Suchergebnisse
   */
  applyFilter(query: string | null): void {
    this.searchForUser(query);
    this.searchForChannel(query);
    this.searchForMessages(query);
  }

  /**
   * Sucht nach Nachrichten in Kanälen, die den Suchbegriff enthalten
   */
  private searchForMessages(query: string | null): void {
    // Stelle sicher, dass keine Nachricht angezeigt wird, wenn weniger als 3 Zeichen eingegeben wurden
    if (!query || query.length < 3) {
      this.filteredList = [];
      this.noMessage = false; // Nachricht ausblenden
      return; // Beende die Funktion sofort
    }

    // Standardmäßig setzen wir die Nachricht auf "keine Ergebnisse"
    this.noMessage = true;

    this.filteredList = this.filterChannelsByMessageContent(query);

    // Falls es Treffer gibt, setzen wir noMessage auf false
    if (this.filteredList.length > 0) this.noMessage = false;
  }

  /**
   * Filtert Kanäle nach Nachrichten, die den Suchbegriff enthalten
   */
  private filterChannelsByMessageContent(query: string): any[] {
    return this.channelService.allChannels
      .map((channel: any) => {
        const messages = Array.isArray(channel.messages)
          ? channel.messages
          : [];

        // Filtere Nachrichten, die den Suchbegriff enthalten
        const filteredMessages = messages.filter((msg: any) =>
          msg.message?.toLowerCase().includes(query.toLowerCase())
        );

        return { ...channel, messages: filteredMessages };
      })
      .filter(
        (channel: any) => channel.messages && channel.messages.length > 0
      );
  }

  /**
   * Sucht nach Benutzern, die mit @ beginnen
   */
  searchForUser(query: string | null): void {
    if (query?.startsWith('@')) {
      if (query.length >= 1) {
        this.isOpen.set(true);
        const usernameQuery = query.slice(1).toLowerCase();
        this.filteredUserNames = this.userService.allUsers.filter((user) =>
          user.name.toLowerCase().includes(usernameQuery.toLowerCase())
        );
      }
    } else this.filteredUserNames = [];
  }

  /**
   * Sucht nach Kanälen, die mit # beginnen
   */
  searchForChannel(query: string | null): void {
    if (query?.startsWith('#')) {
      if (query.length >= 1) {
        const usernameQuery = query.slice(1).toLowerCase();
        this.filteredChannels = this.channelService.allChannels.filter(
          (channel) =>
            channel.name.toLowerCase().includes(usernameQuery.toLowerCase())
        );
      }
    } else this.filteredChannels = [];
  }

  /**
   * Löscht den Suchbegriff
   */
  clearSearch(): void {
    this.searchControl.setValue('');
  }

  /**
   * Setzt alle Chat-Zustände zurück
   */
  resetChat(): void {
    this.searchChatService.resetPanelAndChat();
    this.searchChatService.resetChannelChat();
    this.searchChatService.resetSearchChat();
    this.searchChatService.resetDirectChat();
    this.mainChatService.showMainChat = false;
  }
}
