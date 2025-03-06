import { CommonModule, NgClass, NgIf } from '@angular/common';
import {
  Component,
  effect,
  Input,
  ViewChild,
  ElementRef,
  OnInit,
  AfterViewInit,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { PanelService } from '../../../shared/services/panel.service';
import { PopupService } from '../../../popup/popup.service';
import { ChannelService } from '../../../shared/services/channel.service';
import { UserService } from '../../../shared/services/user.service';
import { EmojiPickerComponent } from '../../../shared/emoji-picker/emoji-picker.component';
import { EmojiCounterService } from '../../../shared/services/emoji-counter.service';
import { MainChatService } from '../../../shared/services/main-chat.service';
import { DirectChatService } from '../../../shared/services/direct-chat.service';
import { GlobalVariablesService } from '../../../shared/services/global-variables.service';
import { User } from '../../../shared/models/user.model';
import { Channel } from '../../../shared/models/channel.model';
import { DirectChat } from '../../../shared/models/direct-chat.model';
import { MessageLike } from '../../../shared/models/message-like.interface';

interface ReactionData {
  reactionsRecord: { [key: string]: MessageLike[] };
  revReactionsRecord: { [key: string]: MessageLike[] };
}

interface TargetData {
  targetMessageId: string;
  targetChannelId: string;
}

@Component({
  selector: 'app-user-message',
  standalone: true,
  imports: [NgClass, NgIf, EmojiPickerComponent, CommonModule, FormsModule],
  templateUrl: './user-message.component.html',
  styleUrl: './user-message.component.scss',
})
export class UserMessageComponent implements OnInit, AfterViewInit {
  @Input() public path: any;
  @Input() public parentElement: any;
  @Input() public messageId: any;
  @Input() public channelId: string = '';
  @Input() public isContact: boolean = false;
  @Input() public isDirectChat: boolean = false;
  @Input() public isReply: boolean = false;
  @Input() public isFirstReply: boolean = false;
  @Input() public isChannelReply: boolean = false;
  @Input() public lastAnswerTime: any = '';
  @Input() public numberOfAnswers: number = 0;

  @ViewChild('editMessage') public editMessage!: ElementRef;

  public messageObj: any;
  public message: string = '';
  public time: string = '';
  public name: string = '';
  public imgUrl: string = '';
  public likes: MessageLike[] = [];
  public loggedInUser: any;
  public editMessagePopupOpen: boolean = false;
  public showEmojiPicker: boolean = false;
  public editedMessage: string = '';
  public renderReplyMessage: boolean = false;
  public currentChannel: Channel = new Channel();
  public currentDirectChat: DirectChat = new DirectChat();
  public emojiInput$: Subject<string> = new Subject<string>();

  constructor(
    private panelService: PanelService,
    private popupService: PopupService,
    private channelService: ChannelService,
    private userService: UserService,
    private emojiCounterService: EmojiCounterService,
    private mainChatService: MainChatService,
    private directChatService: DirectChatService,
    public globalVariablesService: GlobalVariablesService
  ) {
    this.initializeLoggedInUserEffect();
    this.initializeReplyMessageEffect();
    this.initializeChannelEffect();
    this.initializeDirectChatEffect();
  }

  private initializeLoggedInUserEffect(): void {
    effect(() => {
      this.loggedInUser = this.userService.loggedInUser();
    });
  }

  private initializeReplyMessageEffect(): void {
    effect(() => {
      this.renderReplyMessage = this.mainChatService.renderReplyMessage();

      if (this.renderReplyMessage && this.isFirstReply) {
        this.getMessageFromId(this.messageId);
        this.resetReplyMessageRender();
      }
    });
  }

  private resetReplyMessageRender(): void {
    setTimeout(() => this.mainChatService.renderReplyMessage.set(false), 0);
  }

  private initializeChannelEffect(): void {
    effect(() => {
      this.currentChannel = this.channelService.currentChannel();
      this.setReplyMessageRender();
    });
  }

  private setReplyMessageRender(): void {
    setTimeout(() => this.mainChatService.renderReplyMessage.set(true), 0);
  }

  private initializeDirectChatEffect(): void {
    effect(() => {
      this.currentDirectChat = this.directChatService.currentDirectChat();
    });
  }

  public get editingUserProfile(): boolean {
    return this.popupService.editingUserProfile;
  }

  public set editingUserProfile(value: boolean) {
    this.popupService.editingUserProfile = value;
  }

  public get openUserProfilePopup(): boolean {
    return this.popupService.openUserProfilePopup;
  }

  public set openUserProfilePopup(value: boolean) {
    this.popupService.openUserProfilePopup = value;
  }

  public get allUsers(): User[] {
    return this.userService.allUsers;
  }

  public get currentEditMessageId(): string {
    return this.mainChatService.currentEditMessageId;
  }

  public set currentEditMessageId(value: string) {
    this.mainChatService.currentEditMessageId = value;
  }

  public get firstReplyMessageId(): string {
    return this.panelService.messageId;
  }

  ngOnInit(): void {
    this.getMessageFromId(this.messageId);
  }

  ngAfterViewInit(): void {
    if (this.editMessage) this.adjustTextareaHeight();
  }

  public onContainerClick(event: MouseEvent, messageId: string): void {
    if ((event.target as HTMLElement).closest('.reaction-item')) return;

    event.preventDefault();
    this.getMessageFromId(messageId);
  }

  public adjustTextareaHeight(): void {
    const textarea = this.editMessage.nativeElement;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  }

  public getMessageFromId(messageId: string): void {
    this.findAndSetMessageObject(messageId);
    this.updateMessageDetails();
  }

  private findAndSetMessageObject(messageId: string): void {
    if (this.isFirstReply) this.messageObj = this.findMessageInCurrentChat();
    else {
      this.messageObj = this.path?.find(
        (message: any) => message.id === messageId
      );
    }
  }

  private findMessageInCurrentChat(): any {
    if (this.currentChannel.id !== '') {
      return this.currentChannel?.messages?.find(
        (message: any) => message.id === this.firstReplyMessageId
      );
    } else {
      return this.currentDirectChat?.messages?.find(
        (message: any) => message.id === this.firstReplyMessageId
      );
    }
  }

  private updateMessageDetails(): void {
    this.message = this.messageObj?.message;
    this.time = this.channelService.formatTime(this.messageObj?.timestamp);
    this.updateUserDetails();
    this.likes = this.messageObj?.likes || [];
  }

  private updateUserDetails(): void {
    const user = this.userService.getUserById(this.messageObj?.userId);
    this.name = user?.name || 'NAN = Not A NAME';
    this.imgUrl = user?.image || 'imgs/avatar/profile.svg';
  }

  public getMessageLikes(): { [key: string]: MessageLike[] } {
    return { [this.messageId]: this.likes };
  }

  public getReplyLikes(): { [key: string]: MessageLike[] } {
    return { [this.messageId]: this.likes };
  }

  public toggleEditMessagePopup(): void {
    this.editMessagePopupOpen = !this.editMessagePopupOpen;
  }

  public async openReplyPanel(): Promise<void> {
    this.setCurrentReplyMessageId();
    this.setupReplyPanel();
    this.enablePanelScrolling();
    await this.scheduleReplyMessageRender();
  }

  private setCurrentReplyMessageId(): void {
    this.channelService.currentReplyMessageId.set(this.messageId);
  }

  private setupReplyPanel(): void {
    this.panelService.renderReplyPanel(
      this.isContact,
      this.numberOfAnswers,
      this.messageId
    );
    this.panelService.openReplyPanel();
  }

  private enablePanelScrolling(): void {
    this.panelService.scroll = true;
  }

  private scheduleReplyMessageRender(): Promise<void> {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        this.mainChatService.renderReplyMessage.set(true);
        resolve();
      }, 0);
    });
  }

  public reactOnEmoji(
    emoji: string,
    user: string,
    messageId: string,
    channel: string,
    likes: MessageLike[]
  ): void {
    const reactionData: ReactionData = this.prepareReactionData(likes);
    const targetData: TargetData = this.determineTargetData();

    this.handleEmojiReaction(emoji, user, messageId, reactionData, targetData);
  }

  private prepareReactionData(likes: MessageLike[]): ReactionData {
    return {
      reactionsRecord: { [this.messageObj?.id]: likes },
      revReactionsRecord: { [this.messageObj?.id]: likes },
    };
  }

  private determineTargetData(): TargetData {
    return {
      targetMessageId: this.getTargetMessageId(),
      targetChannelId: this.getTargetChannelId(),
    };
  }

  private getTargetMessageId(): string {
    return !this.isFirstReply && this.isReply
      ? this.parentElement?.id
      : this.messageObj?.id;
  }

  private getTargetChannelId(): string {
    return this.currentChannel.id === ''
      ? this.currentDirectChat.id || ''
      : this.currentChannel.id;
  }

  private handleEmojiReaction(
    emoji: string,
    user: string,
    messageId: string,
    reactionData: ReactionData,
    targetData: TargetData
  ): void {
    this.emojiCounterService.handleEmojiLogic(
      emoji,
      targetData.targetMessageId,
      user,
      targetData.targetChannelId,
      reactionData.reactionsRecord,
      this.isReply,
      messageId,
      reactionData.revReactionsRecord,
      this.isDirectChat,
      this.isFirstReply
    );
  }

  public closeEditMessagePopup(): void {
    this.editMessagePopupOpen = false;
  }

  public openProfilePopup(userId: string = this.messageObj.userId): void {
    let user = this.getUser(userId);
    this.popupService.contactProfileContent = user || new User();

    if (this.loggedInUser.id === userId) this.openUserProfilePopupFunction();
    else this.openContactProfilePopup(user || new User());
  }

  public openUserProfilePopupFunction(): void {
    this.popupService.openUserProfilePopup = true;
    this.popupService.editingUserProfile = false;
  }

  public openContactProfilePopup(user: User): void {
    this.popupService.contactProfileContent = user;
    this.popupService.contactProfilePopupOpen = true;
  }

  public getUser(userId: string): User | undefined {
    return this.allUsers.find((user) => user.id === userId);
  }

  public setEmoji(emoji: string): void {
    this.emojiInput$.next(emoji);
  }

  public sortedLikes(): MessageLike[] {
    return this.likes.sort((a, b) => b.count - a.count);
  }

  public setCurrentEditMessageId(): void {
    this.currentEditMessageId = this.messageId;
    this.editedMessage = this.message.trim();
  }

  public saveEditedMessage(): void {
    if (this.isInChannelChat()) this.handleChannelMessageEdit();
    else this.handleDirectMessageEdit();

    this.resetEditMessage();
  }

  private isInChannelChat(): boolean {
    return this.currentChannel.id !== '';
  }

  private handleChannelMessageEdit(): void {
    if (this.isMainMessage()) this.editChannelMainMessage();
    else this.editChannelReplyMessage();
  }

  private handleDirectMessageEdit(): void {
    if (this.isMainMessage()) this.editDirectMainMessage();
    else this.editDirectReplyMessage();
  }

  private isMainMessage(): boolean {
    return !this.isReply || this.isFirstReply;
  }

  private editChannelMainMessage(): void {
    this.channelService.editMessage(
      this.getTargetEditMessageId(),
      this.editedMessage
    );
  }

  private editChannelReplyMessage(): void {
    this.channelService.editReply(
      this.firstReplyMessageId,
      this.messageId,
      this.editedMessage
    );
  }

  private editDirectMainMessage(): void {
    this.directChatService.editMessage(
      this.getTargetEditMessageId(),
      this.editedMessage
    );
  }

  private editDirectReplyMessage(): void {
    this.directChatService.editReply(
      this.firstReplyMessageId,
      this.messageId,
      this.editedMessage
    );
  }

  private getTargetEditMessageId(): string {
    return this.isFirstReply ? this.firstReplyMessageId : this.messageId;
  }

  public resetEditMessage(): void {
    this.currentEditMessageId = '';
    this.closeEditMessagePopup();
  }

  public onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.saveEditedMessage();
    }
  }

  public insertEmoji(emoji: string): void {
    this.editedMessage += emoji;
  }

  public formatMessage(message: string): string {
    if (!message) return '';
    return this.formatMentions(message);
  }

  private formatMentions(message: string): string {
    // Suche nach @-Mentions
    const mentionPattern: RegExp = /@([\w\s.-]+)/g;
    let formattedMessage = message.replace(
      mentionPattern,
      (match: string, username: string) => {
        const trimmedUsername = username.trim();
        const user: string | undefined =
          this.findUserByMention(trimmedUsername);
        return user ? this.createMentionSpan(trimmedUsername) : match;
      }
    );

    // Suche nach Namen ohne @-Symbol
    const allUsers = this.currentChannel.users
      .map((userId: string) => this.userService.getUserById(userId)?.name)
      .filter(Boolean);

    allUsers.forEach((username) => {
      if (username) {
        const namePattern = new RegExp(
          `@\\b${username}\\b(?![^<]*>|[^<>]*</)`,
          'g'
        );

        formattedMessage = formattedMessage.replace(
          namePattern,
          (match: string) => this.createNameSpan(match)
        );
      }
    });

    return formattedMessage;
  }

  private findUserByMention(username: string): string | undefined {
    return this.currentChannel.users.find(
      (userId: string) =>
        this.userService.getUserById(userId)?.name === username
    );
  }

  private createMentionSpan(username: string): string {
    return `
      <span class="p-[3px] select-none bg-bg text-primary  rounded-[5px]">@${username}</span>
      `;
  }

  private createNameSpan(username: string): string {
    return `
      <span class="p-[3px] select-none bg-bg text-primary rounded-[5px]">${username}</span>
      `;
  }
}
