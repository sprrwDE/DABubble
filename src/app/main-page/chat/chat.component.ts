import { CommonModule, NgFor } from '@angular/common';
import { Component, ViewChild, ElementRef, effect } from '@angular/core';
import { UserMessageComponent } from './user-message/user-message.component';
import { MessageInputComponent } from './message-input/message-input.component';
import { PopupService } from '../../popup/popup.service';
import { ChannelService } from '../../shared/services/channel.service';
import { UserService } from '../../shared/services/user.service';
import { FormsModule } from '@angular/forms';
import { User } from '../../shared/models/user.model';
import { Message } from '../../shared/models/message.model';
import { Channel } from '../../shared/models/channel.model';
import { ChatHeaderComponent } from './chat-header/chat-header.component';
import { DirectChatService } from '../../shared/services/direct-chat.service';
import { DirectChat } from '../../shared/models/direct-chat.model';
import { SearchChatService } from '../../shared/services/search-chat.service';
import { GlobalVariablesService } from '../../shared/services/global-variables.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    CommonModule,
    UserMessageComponent,
    MessageInputComponent,
    FormsModule,
    NgFor,
    ChatHeaderComponent,
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
})
export class ChatComponent {
  public channelDetailsPopupOpen: boolean = false;
  public channelDetailsPopupType: string = '';
  public channelDetailsPopupCorner: string = '';
  public memberListPopupOpen: boolean = false;
  public memberListPopupType: string = '';
  public memberListPopupCorner: string = '';
  loggedInUser: any;
  scroll: boolean = true;
  currentChannel: Channel = new Channel();
  currentDirectChat: DirectChat = new DirectChat();
  currentDirectChatUser: User = new User();
  @ViewChild('chatContainer') private chatContainer!: ElementRef;

  constructor(
    public popupService: PopupService,
    public channelService: ChannelService,
    public userService: UserService,
    public directChatService: DirectChatService,
    public searchChatService: SearchChatService,
    public globalVariablesService: GlobalVariablesService
  ) {
    effect(() => {
      if (this.channelService.currentChannel())
        this.currentChannel = this.channelService.currentChannel();
      else this.currentChannel = new Channel();
    });

    effect(() => {
      this.loggedInUser = this.userService.loggedInUser();
    });

    effect(() => {
      this.currentDirectChat = this.directChatService.currentDirectChat();
    });

    effect(() => {
      this.currentDirectChatUser =
        this.directChatService.currentDirectChatUser();
    });
  }

  get allChannels() {
    return this.channelService.allChannels;
  }

  get allUsers() {
    return this.userService.allUsers;
  }

  get isDirectChat() {
    return this.directChatService.isDirectChat;
  }

  get channelUsers() {
    const userIds = this.currentChannel?.users;
    return this.allUsers.filter((user) => userIds?.includes(user.id));
  }

  get searchChat() {
    return this.searchChatService.searchChat;
  }

  get contactProfileContent() {
    return this.popupService.contactProfileContent;
  }

  ngOnInit() {
    this.channelService.chatComponent = this;
  }

  getLikes(message: Message) {
    return message.likes || [];
  }

  openContactProfilePopup(user: User) {
    this.popupService.contactProfileContent = user;
    this.popupService.contactProfilePopupOpen = true;
  }

  openUserProfilePopup() {
    this.popupService.openUserProfilePopup = true;
    this.popupService.editingUserProfile = false;
  }

  openProfilePopup(user: User) {
    this.popupService.contactProfileContent = user;

    if (this.loggedInUser.id === this.contactProfileContent.id)
      this.openUserProfilePopup();
    else this.openContactProfilePopup(this.currentDirectChatUser);
  }

  scrollToBottom() {
    if (this.chatContainer) {
      this.chatContainer.nativeElement.scrollTo({
        top: this.chatContainer.nativeElement.scrollHeight,
        behavior: 'smooth',
      });
    }
  }

  checkScrollToBottom(message: Message, messages: Message[]) {
    if (this.scroll && messages?.[messages.length - 1] === message) {
      setTimeout(() => {
        this.scrollToBottom();
        this.scroll = false;
      }, 100);
    }
  }

  checkIfContact(
    userId: string,
    message: Message,
    messages: Message[]
  ): boolean {
    this.checkScrollToBottom(message, messages);

    if (this.loggedInUser) {
      let loggedInUserId = this.loggedInUser.id;
      return loggedInUserId !== userId;
    } else return false;
  }

  getLastAnswerTime(replies: any[] | undefined): any {
    if (!replies || replies.length === 0) return '';

    return this.channelService.formatTime(
      replies[replies.length - 1].timestamp
    );
  }

  getNumberOfAnswers(replies: any[] | undefined): number {
    if (!replies) return 0;
    return replies.length;
  }

  showDateDivider(message: Message, messages: Message[] | undefined): boolean {
    if (!messages) return false;

    const currentDate = new Date(message.timestamp).toDateString();
    const index = messages.indexOf(message);

    if (index === 0) return true;

    const previousDate = new Date(messages[index - 1].timestamp).toDateString();
    return currentDate !== previousDate;
  }

  private isToday(date: Date): boolean {
    const today: Date = new Date();
    return date.toDateString() === today.toDateString();
  }

  private isYesterday(date: Date): boolean {
    const yesterday: Date = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return date.toDateString() === yesterday.toDateString();
  }

  private getGermanDateFormat(date: Date): string {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      day: 'numeric',
    };
    return date.toLocaleDateString('de-DE', options);
  }

  formatDate(timestamp: number): string {
    const messageDate: Date = new Date(timestamp);

    if (this.isToday(messageDate)) {
      return 'heute';
    } else if (this.isYesterday(messageDate)) {
      return 'gestern';
    } else {
      return 'am ' + this.getGermanDateFormat(messageDate);
    }
  }
}
