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
import { GlobalVariablesService } from '../shared/services/global-variables.service';
import { SearchChatService } from '../shared/services/search-chat.service';
import { EmojiPickerComponent } from '../shared/emoji-picker/emoji-picker.component';
import { Channel } from '../shared/models/channel.model';
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
  ],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.scss',
})
export class MainPageComponent {
  @ViewChild(HeaderBarComponent) headerComponent!: HeaderBarComponent;
  @ViewChild(SidebarNavComponent) sidebarNavComponent!: SidebarNavComponent;
  @ViewChild(EmojiPickerComponent, { static: false })
  emojiPickerComponent!: EmojiPickerComponent;

  // afkDelay = 3000; // zum testen auf 3 Sekunden stellen
  afkDelay = 5 * 60 * 1000; // 5 Minuten in Millisekunden
  timeoutId: any;
  loggedInUser: any;
  public isMobile: boolean = false;
  public isTablet: boolean = false;
  public currentChannel: Channel = new Channel();

  selectedUser: User = new User();

  constructor(
    public panelService: PanelService,
    public popupService: PopupService,
    public userService: UserService,
    private fb: FirebaseService,
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

    effect(() => {
      this.isTablet = this.globalVariablesService.isTablet();
    });

    window.addEventListener('resize', () => {
      if (this.isTablet) {
        if (this.panelService.isReplyPanelOpen) this.panelService.openSidebar();
      }

      if (window.innerWidth > 2000) this.panelService.isSidebarOpen = true;
    });

    // Füge Event-Listener für Tab-Visibility hinzu
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) this.updateUserStatus('offline');
      else this.updateUserStatus('online');
    });
  }

  get allUsers() {
    return this.userService.allUsers;
  }

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

  get currentEditMessageId() {
    return this.mainChatService.currentEditMessageId;
  }

  set currentEditMessageId(value: string) {
    this.mainChatService.currentEditMessageId = value;
  }

  get loading() {
    return this.globalVariablesService.loading;
  }

  // Füge Event-Listener für Fenster/Tab-Schließung hinzu
  @HostListener('window:beforeunload')
  onBeforeUnload() {
    this.updateUserStatus('offline');
  }

  @HostListener('mousemove')
  @HostListener('keydown')
  @HostListener('click')
  afkMode() {
    const user = this.userService.loggedInUser();

    // Prüfe, ob der User schon online ist → vermeide unnötige Schreibvorgänge
    if (user?.status !== 'online') this.updateUserStatus('online');

    // Verhindere mehrfach gesetzte Timeouts, indem der vorherige gelöscht wird
    clearTimeout(this.timeoutId);

    // Setze einen neuen Timeout für 5 Minuten
    this.timeoutId = setTimeout(
      () => this.updateUserStatus('abwesend'),
      this.afkDelay
    );
  }

  updateUserStatus(status: string) {
    const user = this.userService.loggedInUser();

    if (user && user.id) {
      // Falls sich der Status nicht geändert hat, beende die Funktion
      if (user.status === status) return;

      // Erstelle eine neue User-Instanz mit dem aktualisierten Status
      const updatedUser = new User({ ...user, status });

      // Signal aktualisieren
      this.userService.loggedInUser.set(updatedUser);

      // Firebase-Update ausführen
      this.fb.updateStateUser(user.id, status);
    }
  }

  toggleSidebar() {
    if (!this.panelService.isSidebarOpen) this.panelService.openSidebar();
    else this.panelService.isSidebarOpen = false;
  }

  closePopups() {
    this.searchChatService.openSearchPopup = false;
    this.headerComponent.clearSearch();
    this.sidebarNavComponent.clearSearch();
    if (this.emojiPickerComponent && !this.emojiPickerComponent.showEmojiPicker)
      this.currentEditMessageId = '';

    this.popupService.closeUserPopup();
  }
}
