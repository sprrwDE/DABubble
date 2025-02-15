import { Component, ViewChild, ElementRef, effect } from '@angular/core';
import { PanelService } from '../../shared/services/panel.service';
import { MessageInputComponent } from '../chat/message-input/message-input.component';
import { UserMessageComponent } from '../chat/user-message/user-message.component';
import { ChannelService } from '../../shared/services/channel.service';
import { UserService } from '../../shared/services/user.service';
import { CommonModule } from '@angular/common';
import { User } from '../../shared/models/user.model';
import { Subscription } from 'rxjs';
import { Channel } from '../../shared/models/channel.model';
import { GlobalVariablesService } from '../../shared/services/global-variables.service';
import { DirectChatService } from '../../shared/services/direct-chat.service';
import { DirectChat } from '../../shared/models/direct-chat.model';
import { Reply } from '../../shared/models/reply.model';

@Component({
  selector: 'app-reply-panel',
  standalone: true,
  imports: [UserMessageComponent, MessageInputComponent, CommonModule],
  templateUrl: './reply-panel.component.html',
  styleUrl: './reply-panel.component.scss',
})
export class ReplyPanelComponent {
  @ViewChild('chatContainer') chatContainer!: ElementRef;
  public loggedInUser: any;
  public currentChannel: Channel = new Channel();
  public isMobile: boolean = false;
  public currentDirectChatUser: User = new User();
  public currentDirectChat: DirectChat = new DirectChat();

  constructor(
    public panelService: PanelService,
    public channelService: ChannelService,
    public userService: UserService,
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

    effect(() => {
      this.currentDirectChat = this.directChatService.currentDirectChat();
    });
  }

  ngOnInit() {
    this.panelService.replyPanelComponent = this;
    console.log()
  }

  get isDirectChat() {
    return this.directChatService.isDirectChat;
  }

  get currentChannelMessages() {
    return this.channelService.currentChannelMessages;
  }

  get currentReplyMessageId() {
    return this.channelService.currentReplyMessageId;
  }

  get allUsers() {
    return this.userService.allUsers;
  }

  get scroll() {
    return this.panelService.scroll;
  }

  set scroll(value: boolean) {
    this.panelService.scroll = value;
  }

  scrollToBottom() {
    this.chatContainer.nativeElement.scrollTo({
      top: this.chatContainer.nativeElement.scrollHeight,
      behavior: 'smooth',
    });
  }

  checkScrollToBottom(reply: Reply, replies: Reply[]) {
    if (this.scroll && replies?.[replies.length - 1] === reply) {
      setTimeout(() => {
        this.scrollToBottom();
        this.scroll = false;
      }, 100);
    }
  }

  getUserNameAndScroll(userId: string, reply: Reply, replies: Reply[]) {
    this.checkScrollToBottom(reply, replies);

    return (
      this.allUsers.find((user: User) => user.id === userId)?.name ||
      'NAN = Not A NAME'
    );
  }

  getImgUrl(userId: string) {
    return (
      this.allUsers.find((user: User) => user.id === userId)?.image ||
      'imgs/avatar1.png'
    );
  }

  checkIfContact(userId: string): boolean {
    let loggedInUserId = this.loggedInUser.id;

    return loggedInUserId !== userId;
  }

  getRepliesForMessage(messageId: string) {
    return (
      this.currentChannel.messages?.find((message) => message.id === messageId)
        ?.replies || []
    );
  }

  getDirectChatRepliesForMessage(messageId: string) {
    return (
      this.currentDirectChat?.messages?.find(
        (message) => message.id === messageId
      )?.replies || []
    );
  }
  
  getMsgId(messageId: string) {
    return messageId
  }

  // ngOnDestroy() {
  //   this.unsubscribeLoggedInUser.unsubscribe();
  // }
}
