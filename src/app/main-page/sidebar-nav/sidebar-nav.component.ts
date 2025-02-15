import { CommonModule, DOCUMENT } from '@angular/common';
import {
  Component,
  effect,
  EventEmitter,
  Output,
  ViewChild,
  ElementRef,
  Renderer2,
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
import { DirectChat } from '../../shared/models/direct-chat.model';
import { SearchChatService } from '../../shared/services/search-chat.service';
import { MainChatService } from '../../shared/services/main-chat.service';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { animate, state, style, transition, trigger } from '@angular/animations';

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
  noMessage:boolean = false;


  @Output() openPopupEvent = new EventEmitter<{
    type: string;
    corner: string;
  }>();

  public loggedInUser: any;
  public currentChannel: Channel = new Channel();
  public isMobile: boolean = false;
  public currentDirectChatUser: User = new User();

  @ViewChild('allUsersContainer') allUsersContainer!: ElementRef;

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
    private renderer: Renderer2, @Inject(DOCUMENT) private document: Document
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

  test() {
    console.error("HIIIIIIIIIER")
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

}
