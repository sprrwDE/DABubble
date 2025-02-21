import { CommonModule, NgClass, NgIf } from '@angular/common';
import {
  Component,
  effect,
  Input,
  ViewChild,
  ElementRef,
  OnDestroy,
} from '@angular/core';
import { PanelService } from '../../../shared/services/panel.service';
import { PopupService } from '../../../popup/popup.service';
import { ChannelService } from '../../../shared/services/channel.service';
import { UserService } from '../../../shared/services/user.service';
import { User } from '../../../shared/models/user.model';
import { EmojiPickerComponent } from '../../../shared/emoji-picker/emoji-picker.component';
import { Subject } from 'rxjs';
import { EmojiCounterService } from '../../../shared/services/emoji-counter.service';
import { MainChatService } from '../../../shared/services/main-chat.service';
import { FormsModule } from '@angular/forms';
import { Channel } from '../../../shared/models/channel.model';
import { DirectChat } from '../../../shared/models/direct-chat.model';
import { DirectChatService } from '../../../shared/services/direct-chat.service';

@Component({
  selector: 'app-user-message',
  standalone: true,
  imports: [NgClass, NgIf, EmojiPickerComponent, CommonModule, FormsModule],
  templateUrl: './user-message.component.html',
  styleUrl: './user-message.component.scss',
})
export class UserMessageComponent {
  @Input() path: any;
  @Input() parentElement: any;
  @Input() messageId: any;
  @Input() channelId: string = '';

  @Input() isContact: boolean = false;
  @Input() isDirectChat: boolean = false;
  @Input() isReply: boolean = false;
  @Input() isFirstReply: boolean = false;
  @Input() isChannelReply: boolean = false;

  @Input() lastAnswerTime: any = '';
  @Input() numberOfAnswers: number = 0;

  messageObj: any;
  message: string = '';
  time: string = '';
  name: string = '';
  imgUrl: string = '';
  likes: Array<{ emoji: string; count: number; userIds: string[] }> = [];

  loggedInUser: any;

  editMessagePopupOpen: boolean = false;
  showEmojiPicker = false;

  editedMessage: string = '';

  emojiInput$ = new Subject<string>();

  renderReplyMessage: boolean = false;

  currentChannel: Channel = new Channel();
  currentDirectChat: DirectChat = new DirectChat();

  @ViewChild('editMessage') editMessage!: ElementRef;

  constructor(
    private panelService: PanelService,
    private popupService: PopupService,
    private channelService: ChannelService,
    private userService: UserService,
    private emojiCounterService: EmojiCounterService,
    private mainChatService: MainChatService,
    private directChatService: DirectChatService
  ) {
    effect(() => {
      this.loggedInUser = this.userService.loggedInUser();
    });

    effect(() => {
      this.renderReplyMessage = this.mainChatService.renderReplyMessage();

      if (this.renderReplyMessage && this.isFirstReply) {
        this.getMessageFromId(this.messageId);

        setTimeout(() => {
          this.mainChatService.renderReplyMessage.set(false);
        }, 0);
      }
    });

    effect(() => {
      this.currentChannel = this.channelService.currentChannel();

      setTimeout(() => {
        this.mainChatService.renderReplyMessage.set(true);
      }, 0);
    });

    effect(() => {
      this.currentDirectChat = this.directChatService.currentDirectChat();
    });
  }

  get editingUserProfile() {
    return this.popupService.editingUserProfile;
  }

  set editingUserProfile(value: boolean) {
    this.popupService.editingUserProfile = value;
  }

  get openUserProfilePopup() {
    return this.popupService.openUserProfilePopup;
  }

  set openUserProfilePopup(value: boolean) {
    this.popupService.openUserProfilePopup = value;
  }

  get allUsers() {
    return this.userService.allUsers;
  }

  get currentEditMessageId() {
    return this.mainChatService.currentEditMessageId;
  }

  set currentEditMessageId(value: string) {
    this.mainChatService.currentEditMessageId = value;
  }

  get firstReplyMessageId() {
    return this.panelService.messageId;
  }

  ngOnInit() {
    this.getMessageFromId(this.messageId);
  }

  ngAfterViewInit() {
    if (this.editMessage) {
      this.adjustTextareaHeight();
    }
  }

  adjustTextareaHeight() {
    const textarea = this.editMessage.nativeElement;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  }

  getMessageFromId(messageId: string) {
    if (this.isFirstReply) {
      if (this.currentChannel.id !== '') {
        this.messageObj = this.currentChannel?.messages?.find(
          (message: any) => message.id === this.firstReplyMessageId
        );
      } else {
        this.messageObj = this.currentDirectChat?.messages?.find(
          (message: any) => message.id === this.firstReplyMessageId
        );
      }
    } else {
      this.messageObj = this.path?.find(
        (message: any) => message.id === messageId
      );
    }

    this.message = this.messageObj?.message;
    this.time = this.channelService.formatTime(this.messageObj?.timestamp);
    this.name =
      this.userService.getUserById(this.messageObj?.userId)?.name ||
      'NAN = Not A NAME';
    this.imgUrl =
      this.userService.getUserById(this.messageObj?.userId)?.image ||
      'imgs/avatar/profile.svg';
    this.likes = this.messageObj?.likes;
  }

  getMessageLikes() {
    return { [this.messageId]: this.likes };
  }

  getReplyLikes() {
    return { [this.messageId]: this.likes };
  }

  toggleEditMessagePopup() {
    this.editMessagePopupOpen = !this.editMessagePopupOpen;
  }

  async openReplyPanel() {
    this.channelService.currentReplyMessageId.set(this.messageId);

    this.panelService.renderReplyPanel(
      this.isContact,
      this.numberOfAnswers,
      this.messageId
    );

    this.panelService.openReplyPanel();
    this.panelService.scroll = true;

    setTimeout(() => {
      this.mainChatService.renderReplyMessage.set(true);
    }, 0);
  }

  reactOnEmoji(
    emoji: string,
    user: string,
    messageId: string,
    channel: string,
    likes: { emoji: string; count: number; userIds: string[] }[]
  ) {
    const reactionsAsRecord: Record<
      string,
      { emoji: string; count: number; userIds: string[] }[]
    > = { [this.messageObj?.id]: likes }; // hier zusätzliche abfrage first reply + in parameter übergeben....

    const revReactionsAsRecord: Record<
      string,
      { emoji: string; count: number; userIds: string[] }[]
    > = { [this.messageObj?.id]: likes };

    this.emojiCounterService.handleEmojiLogic(
      emoji,
      !this.isFirstReply && this.isReply
        ? this.parentElement?.id
        : this.messageObj?.id,
      user,
      this.currentChannel.id === ''
        ? this.currentDirectChat.id || ''
        : this.currentChannel.id,
      reactionsAsRecord,
      this.isReply,
      messageId,
      revReactionsAsRecord,
      this.isDirectChat,
      this.isFirstReply
    );

    return;
  }

  onMouseLeave() {
    this.editMessagePopupOpen = false;
  }

  openProfilePopup() {
    let user = this.getUser(this.messageObj.userId);

    this.popupService.contactProfileContent = user || new User();

    if (this.loggedInUser.id === this.messageObj.userId)
      this.openUserProfilePopupFunction();
    else this.openContactProfilePopup(user || new User());
  }

  openUserProfilePopupFunction() {
    this.popupService.openUserProfilePopup = true;
    this.popupService.editingUserProfile = false;
  }

  openContactProfilePopup(user: User) {
    this.popupService.contactProfileContent = user;
    this.popupService.contactProfilePopupOpen = true;
  }

  getUser(userId: string) {
    return this.allUsers.find((user) => user.id === userId);
  }

  // Beispiel: Emoji setzen
  setEmoji(emoji: string) {
    this.emojiInput$.next(emoji);
  }

  sortedLikes() {
    return this.likes.sort((a, b) => b.count - a.count);
  }

  setCurrentEditMessageId() {
    this.currentEditMessageId = this.messageId;
    this.editedMessage = this.message.trim();
  }

  saveEditedMessage() {
    if (this.currentChannel.id !== '') {
      if (!this.isReply || this.isFirstReply) {
        this.channelService.editMessage(
          this.isFirstReply ? this.firstReplyMessageId : this.messageId,
          this.editedMessage
        );
      } else {
        this.channelService.editReply(
          this.firstReplyMessageId,
          this.messageId,
          this.editedMessage
        );
      }
    } else {
      if (!this.isReply || this.isFirstReply) {
        this.directChatService.editMessage(
          this.isFirstReply ? this.firstReplyMessageId : this.messageId,
          this.editedMessage
        );
      } else {
        this.directChatService.editReply(
          this.firstReplyMessageId,
          this.messageId,
          this.editedMessage
        );
      }
    }
    this.currentEditMessageId = '';
  }

  onKeyDown(event: KeyboardEvent): void {
    // Prüfen, ob Enter ohne Shift gedrückt wurde
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault(); // Verhindert den Standard-Enter-Ereignis (Zeilenumbruch)
      this.saveEditedMessage()
    }
  }

  insertEmoji(emoji: string) {
    // Emoji an den aktuellen Text anhängen
    this.editedMessage += emoji;
  }
  
}
