import { Component, ViewChild, ElementRef } from '@angular/core';
import { PanelService } from '../../shared/services/panel.service';
import { MessageInputComponent } from '../chat/message-input/message-input.component';
import { UserMessageComponent } from '../chat/user-message/user-message.component';
import { ChannelService } from '../../shared/services/channel.service';
import { UserService } from '../../shared/services/user.service';
import { CommonModule } from '@angular/common';
import { User } from '../../shared/models/user.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-reply-panel',
  standalone: true,
  imports: [UserMessageComponent, MessageInputComponent, CommonModule],
  templateUrl: './reply-panel.component.html',
  styleUrl: './reply-panel.component.scss',
})
export class ReplyPanelComponent {
  @ViewChild('chatContainer') chatContainer!: ElementRef;

  unsubscribeLoggedInUser!: Subscription;

  constructor(
    public panelService: PanelService,
    public channelService: ChannelService,
    public userService: UserService
  ) {}

  ngOnInit() {
    this.panelService.replyPanelComponent = this;
  }

  get currentChannelMessages() {
    return this.channelService.currentChannelMessages;
  }

  get currentChannel() {
    return this.channelService.currentChannel;
  }

  get currentReplyMessageId() {
    return this.channelService.currentReplyMessageId;
  }

  get allUsers() {
    return this.userService.allUsers;
  }

  get loggedInUser() {
    return this.userService.loggedInUser;
  }

  getUserName(userId: string) {
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

    this.unsubscribeLoggedInUser = this.userService.loggedInUser$.subscribe(
      (user: User) => {
        if (user) {
          loggedInUserId = user.id;
        }
      }
    );

    return loggedInUserId !== userId;
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

  ngOnDestroy() {
    this.unsubscribeLoggedInUser.unsubscribe();
  }
}
