import {
  Component,
  Input,
  ViewChild,
  ElementRef,
  OnInit,
  effect,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChannelService } from '../../../shared/services/channel.service';
import { Message } from '../../../shared/models/message.model';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../shared/services/user.service';
import { ChatComponent } from '../chat.component';
import { Reply } from '../../../shared/models/reply.model';
import { ReplyPanelComponent } from '../../reply-panel/reply-panel.component';
import { User } from '../../../shared/models/user.model';
import { Subscription } from 'rxjs';
import { DirectChatService } from '../../../shared/services/direct-chat.service';
import { DirectChat } from '../../../shared/models/direct-chat.model';
import { EmojiPickerComponent } from '../../../shared/emoji-picker/emoji-picker.component';
import { Subject } from 'rxjs';
import { Channel } from '../../../shared/models/channel.model';
import { PopupService } from '../../../popup/popup.service';

@Component({
  selector: 'app-message-input',
  standalone: true,
  imports: [CommonModule, FormsModule, EmojiPickerComponent],
  templateUrl: './message-input.component.html',
  styleUrl: './message-input.component.scss',
})
export class MessageInputComponent implements OnInit {
  @Input() isReplyInput: boolean = false;
  @Input() chatComponent!: ChatComponent;
  @Input() replyPanelComponent!: ReplyPanelComponent;
  @Input() isDirectChatComponent: boolean = false;

  showEmojiPicker = false;
  emojiInput$ = new Subject<string>();

  @ViewChild('chatInput') chatInput!: ElementRef;
  @ViewChild('replyInput') replyInput!: ElementRef;

  public loggedInUser: any;
  unsubLoggedInUser!: Subscription;

  currentDirectChat: DirectChat = new DirectChat();
  currentChannel: Channel = new Channel();
  currentDirectChatUser: User = new User();

  currentReplyMessageId: string = '';

  message: Message = new Message();
  reply: Reply = new Reply();

  allUserIds: string[] = [];

  directChat: DirectChat = new DirectChat();

  showUserPopup = false;

  constructor(
    private channelService: ChannelService,
    public userService: UserService,
    private directChatService: DirectChatService,
    private popupService: PopupService
  ) {
    this.popupService.messageInputComponent = this;
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

    effect(() => {
      this.currentReplyMessageId = this.channelService.currentReplyMessageId();
    });

    effect(() => {
      this.currentChannel = this.channelService.currentChannel();
    });
  }

  ngOnInit(): void {}

  get isDirectChat(): boolean {
    return this.directChatService.isDirectChat;
  }

  get allUsers() {
    return this.userService.allUsers;
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.isReplyInput ? this.sendReply() : this.sendMessage();
    }

    const currentMessage = this.isReplyInput
      ? this.reply.message
      : this.message.message;
    const atIndex = currentMessage.lastIndexOf('@');

    if (atIndex !== -1) {
      const searchText = currentMessage.slice(atIndex + 1).toLowerCase();
      if (this.currentChannel.id === '' && this.currentDirectChat.id !== '') {
        this.allUserIds = this.currentDirectChat.userIds.filter((userId) => {
          const user = this.userService.getUserById(userId);

          return user?.name.toLowerCase().includes(searchText.trim());
        });
      } else {
        this.allUserIds = this.currentChannel.users.filter((userId) => {
          const user = this.userService.getUserById(userId);
          return user?.name.toLowerCase().includes(searchText.trim());
        });
      }
      this.showUserPopup = this.allUserIds.length > 0;
    } else {
      this.popupService.closeUserPopup();
    }

    if (currentMessage === '') {
      this.popupService.closeUserPopup();
    }
  }

  showTagUserPopup() {
    if (this.currentChannel.id === '' && this.currentDirectChat.id !== '') {
      this.allUserIds = this.currentDirectChat.userIds;
    } else {
      this.allUserIds = this.currentChannel.users;
    }

    if (this.isReplyInput) {
      if (
        !this.reply.message ||
        this.reply.message.charAt(this.reply.message.length - 1) !== '@'
      ) {
        this.reply.message += '@';
      }
    } else {
      if (
        !this.message.message ||
        this.message.message.charAt(this.message.message.length - 1) !== '@'
      ) {
        this.message.message += '@';
      }
    }

    this.showUserPopup = true;
  }

  tagUser(userId: string) {
    if (this.isReplyInput) {
      const lastAtIndex = this.reply.message.lastIndexOf('@');
      this.reply.message = this.reply.message.substring(0, lastAtIndex);
      this.reply.message += `@${this.userService.getUserById(userId)?.name} `;
    } else {
      const lastAtIndex = this.message.message.lastIndexOf('@');
      this.message.message = this.message.message.substring(0, lastAtIndex);
      this.message.message += `@${this.userService.getUserById(userId)?.name} `;
    }
    this.showUserPopup = false;
    this.chatInput.nativeElement.focus();
  }

  async sendMessage() {
    console.log(this.channelService.currentChannel());
    if (this.isMessageEmpty()) return;
    this.prepareMessage();

    if (this.isDirectChatComponent) {
      await this.handleDirectChatMessage();
    } else {
      await this.handleChannelMessage();
    }

    this.scroll();
  }

  private isMessageEmpty(): boolean {
    if (this.message.message.trim() === '') {
      console.log('Message is empty');
      return true;
    }
    return false;
  }

  private prepareMessage() {
    this.message.timestamp = new Date().getTime();
    this.message.userId = this.loggedInUser.id;
  }

  private async handleDirectChatMessage() {
    if (this.shouldCreateNewChat()) {
      await this.createNewDirectChat();
    }
    this.directChatService.sendMessage(this.message.toJSON());
    this.message.message = '';
  }

  private shouldCreateNewChat(): boolean {
    const isSelfChat = this.loggedInUser.id === this.currentDirectChatUser.id;
    const userIdCount = this.currentDirectChat.userIds.filter(
      (id) => id === this.loggedInUser.id
    ).length;

    return (
      (!isSelfChat && !this.hasRequiredUsers()) ||
      (isSelfChat && userIdCount !== 2)
    );
  }

  private hasRequiredUsers(): boolean {
    return (
      this.currentDirectChat.userIds.includes(this.loggedInUser.id) &&
      this.currentDirectChat.userIds.includes(this.currentDirectChatUser.id)
    );
  }

  private async createNewDirectChat() {
    this.directChat.userIds = [
      this.loggedInUser.id,
      this.currentDirectChatUser.id,
    ];

    const chatId = await this.directChatService.addDirectChat(
      this.directChat.toJSON()
    );

    if (chatId) {
      this.updateDirectChat(chatId);
    }
  }

  private updateDirectChat(chatId: string) {
    this.directChat.id = chatId;
    this.directChatService.currentDirectChat.set(this.directChat);
    this.directChatService.currentDirectChatId = chatId;
  }

  private async handleChannelMessage() {
    this.channelService.sendMessage(this.message.toJSON());
    this.message.message = '';
  }

  private scroll() {
    this.chatComponent.scroll = true;
    console.log('Successfully sent message!!');
  }

  sendReply() {
    if (this.reply.message.trim() === '') {
      console.log('Message is empty');
      return;
    }
    this.reply.timestamp = new Date().getTime();
    this.reply.userId = this.loggedInUser.id;

    if (this.isDirectChat) {
      this.directChatService.sendReply(
        this.currentReplyMessageId,
        this.reply.toJSON()
      );
    } else {
      this.channelService.sendReply(
        this.currentReplyMessageId,
        this.reply.toJSON()
      );
    }

    this.reply.message = '';

    this.replyPanelComponent.scroll = true;
    console.log('Successfully sent message!!');
  }

  insertEmoji(emoji: string) {
    if (!this.isReplyInput) {
      this.message.message += emoji;
    } else {
      this.reply.message += emoji;
    }
    this.showEmojiPicker = !this.showEmojiPicker;
  }

  ngOnDestroy() {
    if (this.unsubLoggedInUser) {
      this.unsubLoggedInUser.unsubscribe();
    }
  }
}
