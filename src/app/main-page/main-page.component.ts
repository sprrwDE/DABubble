import { Component, effect, HostListener, ViewChild } from '@angular/core';
import { SidebarNavComponent } from './sidebar-nav/sidebar-nav.component';
import { ReplyPanelComponent } from './reply-panel/reply-panel.component';
import { ChatComponent } from './chat/chat.component';
import { HeaderBarComponent } from './header-bar/header-bar.component';
import { CommonModule, NgClass, NgIf } from '@angular/common';
import { User } from '../shared/models/user.model';
import { PanelService } from '../shared/services/panel.service';
import { PopupComponent } from '../popup/popup.component';
import { PopupService } from '../popup/popup.service';
import { UserService } from '../shared/services/user.service';
import { FirebaseService } from '../shared/services/firebase.service';
import { AddUserService } from '../shared/services/add-user.service';
import { GlobalVariablesService } from '../shared/services/global-variables.service';
import { SearchChatService } from '../shared/services/search-chat.service';
import { EmojiPickerComponent } from '../shared/emoji-picker/emoji-picker.component';

import { Channel } from '../shared/models/channel.model';
import { ChannelService } from '../shared/services/channel.service';
import { MainChatService } from '../shared/services/main-chat.service';
@Component({
  selector: 'app-main-page',
  standalone: true,
  imports: [
    SidebarNavComponent,
    ReplyPanelComponent,
    ChatComponent,
    HeaderBarComponent,
    NgClass,
    NgIf,
    CommonModule,
    PopupComponent,
    EmojiPickerComponent,
  ],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.scss',
})
export class MainPageComponent {
  @ViewChild(HeaderBarComponent) headerComponent!: HeaderBarComponent;
  @ViewChild(EmojiPickerComponent, { static: false }) emojiPickerComponent!: EmojiPickerComponent;

  afkDelay: number = 3000;
  timeoutId: any;
  loggedInUser: any;
  public isMobile: boolean = false;
  public currentChannel: Channel = new Channel();

  constructor(
    public panelService: PanelService,
    public popupService: PopupService,
    public userService: UserService,
    private fb: FirebaseService,
    private addUserService: AddUserService,
    private globalVariablesService: GlobalVariablesService,
    private searchChatService: SearchChatService,
    private mainChatService: MainChatService
  ) {
    effect(() => {
      this.loggedInUser = this.userService.loggedInUser();
    });

    effect(() => {
      this.isMobile = this.globalVariablesService.isMobile();
    });
  }
  get allUsers() {
    return this.userService.allUsers;
  }

  // @HostListener('mousemove', ['$event'])
  // afkMode() {
  //   this.updateUserStatus('online');
  //   clearTimeout(this.timeoutId);
  //   this.timeoutId = setTimeout(() => {
  //     this.updateUserStatus('abwesend');
  //   }, this.afkDelay);
  // }

  // updateUserStatus(status: string) {
  //   this.userService.loggedInUser$.subscribe((user) => {
  //     if (user && user.id) {
  //       this.fb.updateStateUser(user.id, status);
  //     }
  //   });
  // }

  openSidebar = true;

  selectedUser: User = new User();

  get createChannelPopupOpen() {
    return this.popupService.createChannelPopupOpen;
  }

  set createChannelPopupOpen(value: boolean) {
    this.popupService.createChannelPopupOpen = value;
  }

  get showMainChat() {
    return this.mainChatService.showMainChat;
  }

  set showMainChat(value: boolean) {
    this.mainChatService.showMainChat = value;
  }

  get contactProfilePopupOpen() {
    return this.popupService.contactProfilePopupOpen;
  }

  set contactProfilePopupOpen(value: boolean) {
    this.popupService.contactProfilePopupOpen = value;
  }

  get isReplyPanelOpen() {
    return this.panelService.isReplyPanelOpen;
  }

  get openUserProfilePopup() {
    return this.popupService.openUserProfilePopup;
  }

  set openUserProfilePopup(value: boolean) {
    this.popupService.openUserProfilePopup = value;
  }

  get channelDetailsPopupOpen() {
    return this.popupService.channelDetailsPopupOpen;
  }

  set channelDetailsPopupOpen(value: boolean) {
    this.popupService.channelDetailsPopupOpen = value;
  }

  get profileMenuPopupOpen() {
    return this.popupService.profileMenuPopupOpen;
  }

  set profileMenuPopupOpen(value: boolean) {
    this.popupService.profileMenuPopupOpen = value;
  }

  get mobileMemberListPopupOpen() {
    return this.popupService.mobileMemberListPopupOpen;
  }

  set mobileMemberListPopupOpen(value: boolean) {
    this.popupService.mobileMemberListPopupOpen = value;
  }

  get showCreateChannelAddPeoplePopup() {
    return this.popupService.showCreateChannelAddPeoplePopup;
  }

  set showCreateChannelAddPeoplePopup(value: boolean) {
    this.popupService.showCreateChannelAddPeoplePopup = value;
  }

  toggleSidebar() {
    this.openSidebar = !this.openSidebar;
  }

  closePopups() {
    this.searchChatService.openSearchPopup = false;
    this.headerComponent.clearSearch();
/*     
    if (this.emojiPickerComponent) {
      this.emojiPickerComponent.toggleEmojiPicker();
    } */
  }

}
