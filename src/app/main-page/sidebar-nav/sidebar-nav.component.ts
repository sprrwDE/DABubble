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
import { TestService } from '../../shared/services/add-user.service';
import { Channel } from '../../shared/models/channel.model';
import { PanelService } from '../../shared/services/panel.service';
import { GlobalVariablesService } from '../../shared/services/global-variables.service';
import { DirectChatService } from '../../shared/direct-chat.service';
import { User } from '../../shared/models/user.model';
import { DirectChat } from '../../shared/models/direct-chat.model';

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
    public test: TestService,
    public panelService: PanelService,
    public globalVariablesService: GlobalVariablesService,
    public directChatService: DirectChatService
  ) {
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

  toggleChannels() {
    this.showChannels = !this.showChannels;
  }

  toggleContacts() {
    this.showContacts = !this.showContacts;
  }

  openPopup(popupType: string, popupCorner: string) {
    this.popupService.showCreateChannelAddPeoplePopup = false;
    this.popupService.showCreateChannelAddPeopleInput = false;
    this.openPopupEvent.emit({ type: popupType, corner: popupCorner });
  }

  setCurrentChannel(channel: Channel) {
    this.panelService.closeReplyPanel();

    this.channelService.currentChannel.set(channel);

    this.directChatService.isDirectChat = false;
    this.directChatService.currentDirectChatUser.set(new User());
    this.channelService.chatComponent.scroll = true;
  }

  setCurrentDirectChat(user: User) {
    this.channelService.currentChannel.set(new Channel());

    let directChat: DirectChat | undefined;

    if (this.loggedInUser.id === user.id) {
      directChat = this.directChatService.allDirectChats.find((chat) => {
        const selfChatCount = chat.userIds.filter(
          (id) => id === this.loggedInUser.id
        ).length;

        if (selfChatCount === 2) {
          this.directChatService.currentDirectChat.set(chat);
          this.directChatService.currentDirectChatId = chat.id || '';
          return true;
        }
        return false;
      });
    }

    if (this.loggedInUser.id !== user.id) {
      directChat = this.directChatService.allDirectChats.find((chat) => {
        if (
          chat.userIds.find((id) => id === this.loggedInUser.id) &&
          chat.userIds.find((id) => id === user.id)
        ) {
          this.directChatService.currentDirectChat.set(chat);
          this.directChatService.currentDirectChatId = chat.id || '';
          return true;
        }
        return false;
      });
    }

    if (!directChat) {
      this.directChatService.currentDirectChat.set(new DirectChat());
    }

    this.directChatService.currentDirectChatUser.set(user);
    this.directChatService.isDirectChat = true;

    setTimeout(() => {
      const activeElement =
        this.allUsersContainer.nativeElement.querySelector('.active-contact');
      if (activeElement) {
        activeElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }, 100);
  }
}
