import { Component, ViewChild, ElementRef, effect } from '@angular/core';
import { PanelService } from '../../shared/services/panel.service';
import { MessageInputComponent } from '../chat/message-input/message-input.component';
import { UserMessageComponent } from '../chat/user-message/user-message.component';
import { ChannelService } from '../../shared/services/channel.service';
import { UserService } from '../../shared/services/user.service';
import { CommonModule } from '@angular/common';
import { User } from '../../shared/models/user.model';
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

  currentReplyMessageId: string = '';

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

    effect(() => {
      this.currentReplyMessageId = this.channelService.currentReplyMessageId();
    });
  }

  ngOnInit() {
    this.panelService.replyPanelComponent = this;
  }

  get isDirectChat() {
    return this.directChatService.isDirectChat;
  }

  get currentChannelMessages() {
    return this.channelService.currentChannelMessages;
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

  checkIfContact(userId: string, reply: Reply, replies: Reply[]): boolean {
    this.checkScrollToBottom(reply, replies);

    let loggedInUserId = this.loggedInUser.id;

    return loggedInUserId !== userId;
  }

  getChannelReplies() {
    return this.currentChannel.messages?.find(
      (message) => message.id === this.currentReplyMessageId
    );
  }

  getDirectChatReplies() {
    return this.currentDirectChat?.messages?.find(
      (message) => message.id === this.currentReplyMessageId
    );
  }
}
