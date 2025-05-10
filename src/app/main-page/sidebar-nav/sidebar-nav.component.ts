import { CommonModule, DOCUMENT } from '@angular/common';
import {
  Component,
  effect,
  EventEmitter,
  Output,
  ViewChild,
  ElementRef,
  Inject,
  signal,
} from '@angular/core';
import { UserService } from '../../shared/services/user.service';
import { PopupService } from '../../popup/popup.service';
import { ChannelService } from '../../shared/services/channel.service';
import { AddUserService } from '../../shared/services/add-user.service';
import { Channel } from '../../shared/models/channel.model';
import { PanelService } from '../../shared/services/panel.service';
import { GlobalVariablesService } from '../../shared/services/global-variables.service';
import { DirectChatService } from '../../shared/services/direct-chat.service';
import { User } from '../../shared/models/user.model';
import { SearchChatService } from '../../shared/services/search-chat.service';
import { MainChatService } from '../../shared/services/main-chat.service';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

@Component({
  selector: 'app-sidebar-nav',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  providers: [],
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
  templateUrl: './sidebar-nav.component.html',
  styleUrl: './sidebar-nav.component.scss',
})
export class SidebarNavComponent {
  showChannels = true;
  showContacts = true;
  showUser = false;
  filteredChannels: any[] = [];
  filteredUserNames: any[] = [];
  filteredList: any = [];
  isSearching: boolean = false;
  searchControl = new FormControl('');
  isOpen = signal(false);
  noMessage: boolean = false;

  @Output() openPopupEvent = new EventEmitter<{
    type: string;
    corner: string;
  }>();

  public loggedInUser: any;
  public currentChannel: Channel = new Channel();
  public isMobile: boolean = false;
  public currentDirectChatUser: User = new User();

  @ViewChild('allUsersContainer') allUsersContainer!: ElementRef;
  @ViewChild('allChannelsContainer') allChannelsContainer!: ElementRef;

  constructor(
    public user: UserService,
    public popupService: PopupService,
    public channelService: ChannelService,
    public userService: UserService,
    public addUserService: AddUserService,
    public panelService: PanelService,
    public globalVariablesService: GlobalVariablesService,
    public directChatService: DirectChatService,
    public searchChatService: SearchChatService,
    public mainChatService: MainChatService,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.searchChatService.sidebarNavComponent = this;

    this.searchControl.valueChanges.subscribe((value) =>
      this.applyFilter(value)
    );

    effect(() => {
      this.loggedInUser = this.userService.loggedInUser();
    });

    effect(() => {
      this.currentChannel = this.channelService.currentChannel();
    });

    effect(() => {
      this.isMobile = this.globalVariablesService.isMobile();
    });

    effect(() => {
      this.currentDirectChatUser =
        this.directChatService.currentDirectChatUser();
    });
  }

  get allChannels() {
    return this.channelService.allChannels;
  }

  get showMainChat() {
    return this.mainChatService.showMainChat;
  }

  toggleChannels() {
    this.showChannels = !this.showChannels;
  }

  toggleContacts() {
    this.showContacts = !this.showContacts;
  }

  openCreateChannelPopup() {
    this.popupService.showCreateChannelAddPeoplePopup = false;
    this.popupService.showCreateChannelAddPeopleInput = false;
    this.popupService.createChannelPopupOpen = true;
  }

  scrollToMessage(message: any, messageId: any, channel: any) {
    this.isSearching = true;
    this.findAndScrollToMatchingMessage(message, messageId, channel);
  }

  /**
   * Sucht nach einer passenden Nachricht im Kanal und scrollt zu ihr
   */
  private findAndScrollToMatchingMessage(
    message: string,
    messageId: string,
    channel: any
  ): void {
    channel.messages.filter((eachMessage: any) => {
      if (this.isMessageMatching(eachMessage.message, message))
        this.scrollToMessageWithDelay(messageId);
    });
  }

  /**
   * Prüft, ob die Nachricht mit dem Suchbegriff übereinstimmt
   */
  private isMessageMatching(messageText: string, searchText: string): boolean {
    return messageText.toLowerCase() === searchText.toLowerCase();
  }

  /**
   * Scrollt zur Nachricht mit einer Verzögerung
   */
  private scrollToMessageWithDelay(messageId: string): void {
    setTimeout(() => {
      this.scrollToElementById(messageId);
      this.isSearching = false;
    }, 500); // Warten, bis der Kanal geladen ist
  }

  /**
   * Scrollt zum Element mit der angegebenen ID
   */
  private scrollToElementById(messageId: string): void {
    const element = this.document.querySelector(
      `[data-message-id="${messageId}"]`
    );
    if (element)
      element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  private initializeSearch(query: string | null): void {
    this.searchForUser(query);
    this.searchForChannel(query);
  }

  private handleShortQuery(query: string | null): void {
    if (!query || query.length < 3) {
      this.filteredList = [];
      this.noMessage = false;
    }
  }

  private filterChannelMessages(channel: any, query: string): any {
    const messages: any[] = Array.isArray(channel.messages)
      ? channel.messages
      : [];
    const filteredMessages = messages.filter((msg: any) =>
      msg.message?.toLowerCase().includes(query.toLowerCase())
    );
    return { ...channel, messages: filteredMessages };
  }

  private updateFilteredList(query: string): void {
    this.noMessage = true;
    this.filteredList = this.channelService.allChannels
      .map((channel: any) => this.filterChannelMessages(channel, query))
      .filter(
        (channel: any) => channel.messages && channel.messages.length > 0
      );

    if (this.filteredList.length > 0) this.noMessage = false;
  }

  applyFilter(query: string | null): void {
    this.initializeSearch(query);

    if (!query || query.length < 3) {
      this.handleShortQuery(query);
      return;
    }

    this.updateFilteredList(query);
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
    } else this.filteredUserNames = [];
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
    } else this.filteredChannels = [];
  }

  clearSearch() {
    this.searchControl.setValue('');
  }

  getUserImage(user: User) {
    if (user.image && user.image !== '' && user.image !== null)
      return user.image;
    return 'imgs/avatar/profile.svg';
  }
}
