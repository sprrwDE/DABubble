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
import { GlobalVariablesService } from '../../../shared/services/global-variables.service';

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

  @ViewChild('chatInput') chatInput!: ElementRef;
  @ViewChild('replyInput') replyInput!: ElementRef;

  public loggedInUser: any;

  showEmojiPicker = false;
  emojiInput$ = new Subject<string>();
  currentDirectChat: DirectChat = new DirectChat();
  currentChannel: Channel = new Channel();
  currentDirectChatUser: User = new User();
  currentReplyMessageId: string = '';
  message: Message = new Message();
  reply: Reply = new Reply();
  allUserIds: string[] = [];
  directChat: DirectChat = new DirectChat();
  showUserPopup = false;
  unsubLoggedInUser!: Subscription;

  constructor(
    private channelService: ChannelService,
    public userService: UserService,
    private directChatService: DirectChatService,
    private popupService: PopupService,
    public globalVariablesService: GlobalVariablesService
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

  private getCurrentMessage(): string {
    return this.isReplyInput ? this.reply.message : this.message.message;
  }

  private handleEnterKey(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.isReplyInput ? this.sendReply() : this.sendMessage();
    }
  }

  private searchUsersInDirectChat(searchText: string): void {
    const uniqueUserIds: string[] = [
      ...new Set(this.currentDirectChat.userIds),
    ];
    this.allUserIds = uniqueUserIds.filter((userId: string) => {
      const user = this.userService.getUserById(userId);
      return user?.name.toLowerCase().includes(searchText.trim());
    });
  }

  private searchUsersInChannel(searchText: string): void {
    this.allUserIds = this.currentChannel.users.filter((userId: string) => {
      const user = this.userService.getUserById(userId);
      return user?.name.toLowerCase().includes(searchText.trim());
    });
  }

  private handleUserSearch(currentMessage: string, atIndex: number): void {
    const searchText: string = currentMessage.slice(atIndex + 1).toLowerCase();

    if (this.currentChannel.id === '' && this.currentDirectChat.id !== '')
      this.searchUsersInDirectChat(searchText);
    else this.searchUsersInChannel(searchText);

    this.showUserPopup = this.allUserIds.length > 0;
  }

  onKeyDown(event: KeyboardEvent): void {
    this.handleEnterKey(event);

    const currentMessage: string = this.getCurrentMessage();
    const atIndex: number = currentMessage.lastIndexOf('@');

    if (atIndex !== -1) this.handleUserSearch(currentMessage, atIndex);
    else this.popupService.closeUserPopup();

    if (currentMessage === '') this.popupService.closeUserPopup();
  }

  private getUserIdsFromCurrentChat(): string[] {
    if (this.currentChannel.id === '' && this.currentDirectChat.id !== '')
      return [...new Set(this.currentDirectChat.userIds)];
    return this.currentChannel.users;
  }

  private appendAtSymbolToMessage(): void {
    if (this.isReplyInput) this.appendAtSymbolToReply();
    else this.appendAtSymbolToDirectMessage();
  }

  private appendAtSymbolToReply(): void {
    if (!this.reply.message || !this.reply.message.endsWith('@'))
      this.reply.message = (this.reply.message || '') + '@';
  }

  private appendAtSymbolToDirectMessage(): void {
    if (!this.message.message || !this.message.message.endsWith('@'))
      this.message.message = (this.message.message || '') + '@';
  }

  showTagUserPopup(): void {
    this.allUserIds = this.getUserIdsFromCurrentChat();
    this.appendAtSymbolToMessage();
    this.showUserPopup = true;
  }

  private appendUserTagToReply(userId: string): void {
    const lastAtIndex: number = this.reply.message.lastIndexOf('@');
    const userName: string = this.userService.getUserById(userId)?.name || '';
    this.reply.message = this.reply.message.substring(0, lastAtIndex);
    this.reply.message += `@${userName} `;
  }

  private appendUserTagToMessage(userId: string): void {
    const lastAtIndex: number = this.message.message.lastIndexOf('@');
    const userName: string = this.userService.getUserById(userId)?.name || '';
    this.message.message = this.message.message.substring(0, lastAtIndex);
    this.message.message += `@${userName} `;
  }

  private resetTaggingState(): void {
    this.showUserPopup = false;
    this.chatInput.nativeElement.focus();
    this.allUserIds = [];
  }

  tagUser(userId: string): void {
    if (this.isReplyInput) this.appendUserTagToReply(userId);
    else this.appendUserTagToMessage(userId);
    this.resetTaggingState();
  }

  async sendMessage() {
    if (this.isMessageEmpty()) return;
    this.prepareMessage();

    if (this.isDirectChatComponent) await this.handleDirectChatMessage();
    else await this.handleChannelMessage();

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
    if (this.shouldCreateNewChat()) await this.createNewDirectChat();
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

    if (chatId) this.updateDirectChat(chatId);
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
  }

  private isReplyEmpty(): boolean {
    return this.reply.message.trim() === '';
  }

  private prepareReply(): void {
    this.reply.timestamp = new Date().getTime();
    this.reply.userId = this.loggedInUser.id;
  }

  private sendReplyToDirectChat(): void {
    this.directChatService.sendReply(
      this.currentReplyMessageId,
      this.reply.toJSON()
    );
  }

  private sendReplyToChannel(): void {
    this.channelService.sendReply(
      this.currentReplyMessageId,
      this.reply.toJSON()
    );
  }

  private resetReplyState(): void {
    this.reply.message = '';
    this.replyPanelComponent.scroll = true;
  }

  sendReply(): void {
    if (this.isReplyEmpty()) return;

    this.prepareReply();

    if (this.isDirectChat) this.sendReplyToDirectChat();
    else this.sendReplyToChannel();

    this.resetReplyState();
  }

  insertEmoji(emoji: string) {
    if (!this.isReplyInput) this.message.message += emoji;
    else this.reply.message += emoji;

    this.showEmojiPicker = !this.showEmojiPicker;
  }

  ngOnDestroy() {
    if (this.unsubLoggedInUser) this.unsubLoggedInUser.unsubscribe();
  }
}
