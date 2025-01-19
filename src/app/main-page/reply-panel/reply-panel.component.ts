import { Component, ViewChild, ElementRef } from '@angular/core';
import { PanelService } from '../../shared/services/panel.service';
import { MessageInputComponent } from '../chat/message-input/message-input.component';
import { UserMessageComponent } from '../chat/user-message/user-message.component';
import { ChannelService } from '../../shared/services/channel.service';
import { UserService } from '../../shared/services/user.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reply-panel',
  standalone: true,
  imports: [UserMessageComponent, MessageInputComponent, CommonModule],
  templateUrl: './reply-panel.component.html',
  styleUrl: './reply-panel.component.scss',
})
export class ReplyPanelComponent {
  @ViewChild('chatContainer') chatContainer!: ElementRef;

  constructor(
    public panelService: PanelService,
    public channelService: ChannelService,
    public userService: UserService
  ) {}

  get currentChannelMessages() {
    return this.channelService.currentChannelMessages;
  }

  get currentChannel() {
    return this.channelService.currentChannel;
  }

  get currentReplyMessageId() {
    return this.channelService.currentReplyMessageId;
  }

  getUserName(userId: string) {
    return (
      this.currentChannel.users.find((user) => user.id === userId)?.name ||
      'NAN = Not A NAME'
    );
  }

  getImgUrl(userId: string) {
    return (
      this.currentChannel.users.find((user) => user.id === userId)?.image ||
      'imgs/avatar1.png'
    );
  }

  getIsContact(userId: string) {
    return this.userService.loggedInUser.id === userId;
  }

  getRepliesForMessage(messageId: string) {
    return (
      this.currentChannelMessages.find((message) => message.id === messageId)
        ?.replies || []
    );
  }

  scrollToBottom() {
    this.chatContainer.nativeElement.scrollTo({
      top: this.chatContainer.nativeElement.scrollHeight,
      behavior: 'smooth',
    });
  }
}
