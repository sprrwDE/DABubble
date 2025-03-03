import {
  Component,
  effect,
  EventEmitter,
  NgZone,
  Output,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { User } from '../../shared/models/user.model';
import { UserService } from '../../shared/services/user.service';
import { FirebaseService } from '../../shared/services/firebase.service';
import { NgClass, NgIf } from '@angular/common';
import { PopupService } from '../popup.service';
import { DirectChatService } from '../../shared/services/direct-chat.service';
import { DirectChat } from '../../shared/models/direct-chat.model';
import { Channel } from '../../shared/models/channel.model';
import { ChannelService } from '../../shared/services/channel.service';
import { GlobalVariablesService } from '../../shared/services/global-variables.service';

@Component({
  selector: 'app-contact-profile-popup',
  standalone: true,
  imports: [NgIf, NgClass],
  templateUrl: './contact-profile-popup.component.html',
  styleUrl: './contact-profile-popup.component.scss',
})
export class ContactProfilePopupComponent {
  @Output() closePopupEvent = new EventEmitter<void>();
  @ViewChild('allUsersContainer') allUsersContainer!: ElementRef;

  currentUser: UserService;
  loggedInUser: any;

  constructor(
    public service: FirebaseService,
    public user: UserService,
    private popupService: PopupService,
    private directChatService: DirectChatService,
    private userService: UserService,
    private channelService: ChannelService,
    public globalVariablesService: GlobalVariablesService
  ) {
    this.currentUser = user;

    effect(() => {
      this.loggedInUser = this.userService.loggedInUser();
    });
  }

  get contactProfileContent() {
    return this.popupService.contactProfileContent;
  }

  closePopup() {
    this.closePopupEvent.emit();
  }

  private initializeChat(): void {
    this.channelService.chatComponent.scroll = true;
    this.channelService.currentChannel.set(new Channel());
  }

  private findExistingDirectChat(user: User): DirectChat | undefined {
    return this.directChatService.allDirectChats.find(
      (directChat) =>
        directChat.userIds.includes(user.id) &&
        directChat.userIds.includes(this.loggedInUser.id)
    );
  }

  private setDirectChat(directChat: DirectChat | undefined, user: User): void {
    this.directChatService.currentDirectChat.set(
      directChat || new DirectChat()
    );
    this.directChatService.currentDirectChatUser.set(user);
    this.directChatService.isDirectChat = true;
  }

  private closePopups(): void {
    this.closePopup();
    this.popupService.memberListPopup.closePopup();
  }

  private scrollToActiveContact(): void {
    setTimeout(() => {
      const sidebarContainer: Element | null =
        document.querySelector('#all-users');
      const activeElement: Element | null =
        sidebarContainer?.querySelector('.active-contact') || null;
      if (activeElement)
        activeElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
  }

  setCurrentDirectChat(user: User): void {
    this.initializeChat();
    const directChat: DirectChat | undefined =
      this.findExistingDirectChat(user);
    this.setDirectChat(directChat, user);
    this.closePopups();
    this.scrollToActiveContact();
  }
}
