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
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
})
export class ChatComponent implements AfterViewInit {
  public channelDetailsPopupOpen: boolean = false;
  public channelDetailsPopupType: string = '';
  public channelDetailsPopupCorner: string = '';

  public memberListPopupOpen: boolean = false;
  public memberListPopupType: string = '';
  public memberListPopupCorner: string = '';

  constructor(
    public popupService: PopupService,
    public channelService: ChannelService,
    public userService: UserService
  ) {}

  get currentChannelId() {
    return this.channelService.currentChannelId;
  }

  get currentChannel() {
    return this.channelService.currentChannel;
  }

  get allChannels() {
    return this.channelService.allChannels;
  }

  get loggedInUser() {
    return this.userService.loggedInUser;
  }

  openChannelDetailsPopup(type: string, corner: string) {
    this.channelDetailsPopupOpen = true;
    this.channelDetailsPopupType = type;
    this.channelDetailsPopupCorner = corner;
  }

  closeChannelDetailsPopup() {
    this.channelDetailsPopupOpen = false;
  }

  openMemberListPopup(
    type: string,
    corner: string,
    showAddMembersPopup: boolean = false
  ) {
    this.memberListPopupOpen = true;
    this.memberListPopupType = type;
    this.memberListPopupCorner = corner;
    this.popupService.showAddMembersPopup = showAddMembersPopup;
  }

  closeMemberListPopup() {
    this.memberListPopupOpen = false;
  }

  @ViewChild('chatContainer') private chatContainer!: ElementRef;

  ngAfterViewInit() {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      this.chatContainer.nativeElement.scrollTop =
        this.chatContainer.nativeElement.scrollHeight;
    } catch (err) {}
  }

  getUserName(userId: string): string {
    return (
      this.currentChannel?.users?.find((user: any) => user.id === userId)
        ?.name || 'Placholder'
    );
  }

  getUserImage(userId: string): string {
    return (
      this.currentChannel?.users?.find((user: any) => user.id === userId)
        ?.image || 'imgs/avatar1.png'
    );
  }

  getUserId(userId: string): string {
    return (
      this.currentChannel?.users?.find((user: any) => user.id === userId)?.id ||
      ''
    );
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
}
