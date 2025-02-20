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
  currentDirectChatUser: User = new User();

  currentReplyMessageId: string = '';

  constructor(
    private channelService: ChannelService,
    private userService: UserService,
    private directChatService: DirectChatService
  ) {
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
  }

  ngOnInit(): void {}

  message: Message = new Message();
  reply: Reply = new Reply();

  directChat: DirectChat = new DirectChat();

  get isDirectChat(): boolean {
    return this.directChatService.isDirectChat;
  }

  onKeyDown(event: KeyboardEvent): void {
    // Prüfen, ob Enter ohne Shift gedrückt wurde
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();  // Verhindert den Standard-Enter-Ereignis (Zeilenumbruch)
      this.isReplyInput ? this.sendReply() : this.sendMessage()         // Formular abschicken
    }
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
