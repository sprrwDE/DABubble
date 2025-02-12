import { CommonModule } from '@angular/common';
import {
  Component,
  effect,
  EventEmitter,
  Output,
  ViewChild,
  ElementRef,
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

@Component({
  selector: 'app-sidebar-nav',
  standalone: true,
  imports: [CommonModule],
  providers: [],
  templateUrl: './sidebar-nav.component.html',
  styleUrl: './sidebar-nav.component.scss',
})
export class SidebarNavComponent {
  showChannels = true;
  showContacts = true;
  showUser = false;
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
    public mainChatService: MainChatService
  ) {
    this.searchChatService.sidebarNavComponent = this;

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
}
