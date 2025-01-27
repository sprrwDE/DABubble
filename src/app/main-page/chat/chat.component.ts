import { CommonModule, NgFor } from '@angular/common';
import {
  Component,
  ViewChild,
  ElementRef,
  AfterViewInit,
  EventEmitter,
  Output,
  Input,
  OnInit,
  effect,
} from '@angular/core';
import { UserMessageComponent } from './user-message/user-message.component';
import { MessageInputComponent } from './message-input/message-input.component';
import { PopupComponent } from '../../popup/popup.component';
import { PopupService } from '../../popup/popup.service';
import { ChannelService } from '../../shared/services/channel.service';
import { UserService } from '../../shared/services/user.service';
import { FormsModule } from '@angular/forms';
import { User } from '../../shared/models/user.model';
import { Message } from '../../shared/models/message.model';
import { publishFacade } from '@angular/compiler';
import { Subscription } from 'rxjs';
import { Channel } from '../../shared/models/channel.model';
import { ChatHeaderComponent } from './chat-header/chat-header.component';
import { DirectChatService } from '../../shared/direct-chat.service';
import { DirectChat } from '../../shared/models/direct-chat.model';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    CommonModule,
    UserMessageComponent,
    MessageInputComponent,
    PopupComponent,
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
    public directChatService: DirectChatService
  ) {
    effect(() => {
      if (this.channelService.currentChannel()) {
        this.currentChannel = this.channelService.currentChannel();
      } else {
        this.currentChannel = new Channel();
      }
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

  // openChannelDetailsPopup(type: string, corner: string) {
  //   this.channelDetailsPopupOpen = true;
  //   this.channelDetailsPopupType = type;
  //   this.channelDetailsPopupCorner = corner;
  // }

  // closeChannelDetailsPopup() {
  //   this.channelDetailsPopupOpen = false;
  // }

  // openMemberListPopup(
  //   type: string,
  //   corner: string,
  //   showAddMembersPopup: boolean = false
  // ) {
  //   this.memberListPopupOpen = true;
  //   this.memberListPopupType = type;
  //   this.memberListPopupCorner = corner;
  //   this.popupService.showAddMembersPopup = showAddMembersPopup;
  // }

  // closeMemberListPopup() {
  //   this.memberListPopupOpen = false;
  // }

  openContactProfilePopup(user: User) {
    this.popupService.contactProfileContent = user;
    this.popupService.contactProfilePopupOpen = true;
  }

  scrollToBottom() {
    if (this.chatContainer) {
      this.chatContainer.nativeElement.scrollTo({
        top: this.chatContainer.nativeElement.scrollHeight,
        behavior: 'smooth',
      });
    }
  }

  checkScrollToBottom(message: Message) {
    if (
      this.scroll &&
      this.currentChannel?.messages?.[
        this.currentChannel?.messages?.length - 1
      ] === message
    ) {
      this.scrollToBottom();
      this.scroll = false;
    }
  }

  getUserName(userId: string): string {
    return (
      this.allUsers.find((user: User) => user.id === userId)?.name || 'lädt...'
    );
  }

  getUserImage(userId: string, message: Message): string {
    this.checkScrollToBottom(message);

    return (
      this.allUsers.find((user: User) => user.id === userId)?.image ||
      'imgs/avatar1.png'
    );
  }

  checkIfContact(userId: string): boolean {
    if (this.loggedInUser) {
      let loggedInUserId = this.loggedInUser.id;
      return loggedInUserId !== userId;
    } else {
      return false;
    }
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

  ngOnInit() {
    this.channelService.chatComponent = this;
  }
}
