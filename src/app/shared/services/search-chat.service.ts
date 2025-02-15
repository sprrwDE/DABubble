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

  allChats: (Channel | DirectChat)[] = [];

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

  get allDirectChats() {
    return this.directChatService.allDirectChats;
  }

  searchChats() {
    this.allChats = [];
    if (this.loggedInUser.id === '') return;

    this.searchChannels();
    this.searchDirectChats();
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
    const channelName = '# ' + channel.name;
    if (!this.matchesSearchTerm(channelName)) return false;

    return channel.users.some((userId) => userId === this.loggedInUser?.id);
  }

  private searchDirectChats() {
    if (this.searchChatInput.startsWith('#')) return;

    this.allDirectChats.forEach((chat) => {
      if (this.shouldAddDirectChat(chat)) {
        this.allChats.push(chat);
      }
    });
  }

  private shouldAddDirectChat(chat: DirectChat): boolean {
    const users = this.getDirectChatUsers(chat);
    if (!this.isUserInChat(users)) return false;

    return this.matchesUserNames(users);
  }

  private getDirectChatUsers(chat: DirectChat) {
    return {
      userOne: this.userService.getUserById(chat.userIds[0]),
      userTwo: this.userService.getUserById(chat.userIds[1]),
    };
  }

  private isUserInChat(users: { userOne?: User; userTwo?: User }): boolean {
    return (
      users.userOne?.id === this.loggedInUser?.id ||
      users.userTwo?.id === this.loggedInUser?.id
    );
  }

  private matchesUserNames(users: { userOne?: User; userTwo?: User }): boolean {
    const nameOne = '@' + users.userOne?.name;
    const nameTwo = '@' + users.userTwo?.name;
    const emailOne = users.userOne?.email || '';
    const emailTwo = users.userTwo?.email || '';

    return (
      this.matchesSearchTerm(nameOne) ||
      this.matchesSearchTerm(nameTwo) ||
      this.matchesSearchTerm(emailOne) ||
      this.matchesSearchTerm(emailTwo)
    );
  }

  private matchesSearchTerm(text: string): boolean {
    return text
      .toLowerCase()
      .trim()
      .includes(this.searchChatInput.toLowerCase().trim());
  }

  // setCurrentChannel
  setCurrentChannel(channel: Channel,  isSearching:boolean = false) {
    this.mainChatService.showMainChat = true;

    this.resetPanelAndChat(isSearching);
    this.channelService.currentChannel.set(channel);
    this.resetDirectChat();
    this.resetSearchChat();
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
    if(!isSearching){
      this.channelService.chatComponent.scroll = true;
    } else {
      this.channelService.chatComponent.scroll = false;
    }
    
  }

  public resetDirectChat() {
    this.directChatService.isDirectChat = false;
    this.directChatService.currentDirectChatUser.set(new User());
  }

  public resetChannelChat() {
    this.channelService.currentChannel.set(new Channel());
  }

  public resetSearchChat() {
    this.searchChat = false;
    this.searchChatInput = '';
    this.allChats = [];
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
}
