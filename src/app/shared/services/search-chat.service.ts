import { effect, Injectable } from '@angular/core';
import { DirectChat } from '../models/direct-chat.model';
import { Channel } from '../models/channel.model';
import { DirectChatService } from './direct-chat.service';
import { ChannelService } from './channel.service';
import { UserService } from './user.service';
import { User } from '../models/user.model';
import { PanelService } from './panel.service';
import { MainChatService } from './main-chat.service';

@Injectable({
  providedIn: 'root',
})
export class SearchChatService {
  searchChat = true;
  searchChatInput: string = '';

  openSearchPopup = false;

  allChats: (Channel | User)[] = [];

  loggedInUser: any;

  sidebarNavComponent: any;
  constructor(
    private channelService: ChannelService,
    private directChatService: DirectChatService,
    private userService: UserService,
    private panelService: PanelService,
    private mainChatService: MainChatService
  ) {
    effect(() => {
      this.loggedInUser = this.userService.loggedInUser();
    });
  }

  get allChannels() {
    return this.channelService.allChannels;
  }

  get allUsers() {
    return this.userService.allUsers;
  }

  searchChats() {
    this.allChats = [];
    if (this.loggedInUser.id === '') return;

    this.searchChannels();
    this.searchUsers();
  }

  private searchChannels() {
    if (this.searchChatInput.startsWith('@')) return;

    this.allChannels.forEach((channel) => {
      if (this.shouldAddChannel(channel)) {
        this.allChats.push(channel);
      }
    });
  }

  private shouldAddChannel(channel: Channel): boolean {
    const channelName = '#' + channel.name.trim();

    if (!this.matchesSearchTerm(channelName)) return false;

    return channel.users.some((userId) => userId === this.loggedInUser?.id);
  }

  private searchUsers() {
    if (this.searchChatInput.startsWith('#')) return;

    this.allUsers.forEach((user) => {
      if (this.shouldAddUser(user)) {
        this.allChats.push(user);
      }
    });
  }

  private shouldAddUser(user: User): boolean {
    const userName = '@' + user.name.trim();
    const userEmail = user.email.trim();
    if (!this.matchesSearchTerm(userName) && !this.matchesSearchTerm(userEmail))
      return false;

    return true;
  }

  private matchesSearchTerm(text: string): boolean {
    return text
      .toLowerCase()
      .trim()
      .includes(this.searchChatInput.toLowerCase().trim());
  }

  // setCurrentChannel
  setCurrentChannel(channel: Channel, isSearching: boolean = false) {
    this.mainChatService.showMainChat = true;

    this.resetPanelAndChat(isSearching);
    this.channelService.currentChannel.set(channel);
    this.resetDirectChat();
    this.resetSearchChat();
    this.scrollToActiveChannel();
  }

  // setSearchChat
  setSearchChat() {
    this.mainChatService.showMainChat = true;
    this.resetDirectChat();
    this.resetChannelChat();
    this.searchChat = true;
  }

  // setCurrentDirectChat
  setCurrentDirectChat(user: User) {
    this.mainChatService.showMainChat = true;
    this.resetPanelAndChat();
    this.resetChannelChat();
    this.resetSearchChat();

    const directChat = this.findExistingDirectChat(user);
    this.updateDirectChatState(directChat, user);
    this.scrollToActiveContact();
  }

  public resetPanelAndChat(isSearching: boolean = false) {
    this.panelService.closeReplyPanel();
    if (!isSearching) {
      this.channelService.chatComponent.scroll = true;
    } else {
      this.channelService.chatComponent.scroll = false;
    }
  }

  public resetDirectChat() {
    this.directChatService.isDirectChat = false;
    this.directChatService.currentDirectChatUser.set(new User());
    this.panelService.closeReplyPanel();
  }

  public resetChannelChat() {
    this.channelService.currentChannel.set(new Channel());
    this.panelService.closeReplyPanel();
  }

  public resetSearchChat() {
    this.searchChat = false;
    this.searchChatInput = '';
    this.allChats = [];
    this.panelService.closeReplyPanel();
  }

  private findExistingDirectChat(user: User): DirectChat | undefined {
    if (this.isSelfChat(user)) {
      return this.findSelfChat();
    }
    return this.findChatWithUser(user);
  }

  private isSelfChat(user: User): boolean {
    return this.loggedInUser.id === user.id;
  }

  private findSelfChat(): DirectChat | undefined {
    return this.directChatService.allDirectChats.find((chat) => {
      const selfChatCount = chat.userIds.filter(
        (id) => id === this.loggedInUser.id
      ).length;
      if (selfChatCount === 2) {
        this.updateDirectChatReference(chat);
        return true;
      }
      return false;
    });
  }

  private findChatWithUser(user: User): DirectChat | undefined {
    return this.directChatService.allDirectChats.find((chat) => {
      if (this.chatIncludesBothUsers(chat, user)) {
        this.updateDirectChatReference(chat);
        return true;
      }
      return false;
    });
  }

  private chatIncludesBothUsers(chat: DirectChat, user: User): boolean {
    return (
      chat.userIds.includes(this.loggedInUser.id) &&
      chat.userIds.includes(user.id)
    );
  }

  private updateDirectChatReference(chat: DirectChat) {
    this.directChatService.currentDirectChat.set(chat);
    this.directChatService.currentDirectChatId = chat.id || '';
  }

  private updateDirectChatState(
    directChat: DirectChat | undefined,
    user: User
  ) {
    if (!directChat) {
      this.directChatService.currentDirectChat.set(new DirectChat());
    }
    this.directChatService.currentDirectChatUser.set(user);
    this.directChatService.isDirectChat = true;
  }

  private scrollToActiveContact() {
    setTimeout(() => {
      const activeElement =
        this.sidebarNavComponent.allUsersContainer.nativeElement.querySelector(
          '.active-contact'
        );
      if (activeElement) {
        activeElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }, 100);
  }

  scrollToActiveChannel() {
    setTimeout(() => {
      const activeElement =
        this.sidebarNavComponent.allChannelsContainer.nativeElement.querySelector(
          '.active-channel'
        );
      if (activeElement) {
        activeElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }, 100);
  }
}
