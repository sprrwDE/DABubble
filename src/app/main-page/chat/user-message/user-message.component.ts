import { NgClass, NgIf } from '@angular/common';
import { Component, effect, Input } from '@angular/core';
import { PanelService } from '../../../shared/services/panel.service';
import { PopupService } from '../../../popup/popup.service';
import { ChannelService } from '../../../shared/services/channel.service';
import { UserService } from '../../../shared/services/user.service';
import { User } from '../../../shared/models/user.model';
import { EmojiPickerComponent } from '../../../shared/emoji-picker/emoji-picker.component';
import { Subject } from 'rxjs';
import { EmojiCounterService } from '../../../shared/services/emoji-counter.service';

@Component({
  selector: 'app-user-message',
  standalone: true,
  imports: [NgClass, NgIf, EmojiPickerComponent],
  templateUrl: './user-message.component.html',
  styleUrl: './user-message.component.scss',
})
export class UserMessageComponent {
  @Input() message: string = '';
  @Input() time: string = '';
  @Input() name: string = '';
  @Input() imgUrl: string = '';
  @Input() isContact: boolean = false;
  @Input() isReplay: boolean = false;
  @Input() lastAnswerTime: any = '';
  @Input() numberOfAnswers: number = 0;
  @Input() likes: Array<{ emoji: string; count: number; userIds: string[] }> =
    [];
  @Input() messageId: any;
  @Input() userId: string = '';
  @Input() channelId: string = '';

  loggedInUser: any;

  editMessagePopupOpen: boolean = false;
  showEmojiPicker = false;

  emojiInput$ = new Subject<string>();

  constructor(
    private panelService: PanelService,
    private popupService: PopupService,
    private channelService: ChannelService,
    private userService: UserService,
    private emojiCounterService: EmojiCounterService
  ) {
    effect(() => {
      this.loggedInUser = this.userService.loggedInUser();
    });
  }

  ngOnInit() {
    console.log('Likes empfangen in UserMessageComponent:', this.likes);
  }

  getMessageLikes() {
    return { [this.messageId]: this.likes };
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

  get currentReplyMessageId() {
    return this.channelService.currentReplyMessageId;
  }

  set currentReplyMessageId(value: string) {
    this.channelService.currentReplyMessageId = value;
  }

  get allUsers() {
    return this.userService.allUsers;
  }

  toggleEditMessagePopup() {
    this.editMessagePopupOpen = !this.editMessagePopupOpen;
  }

  openReplyPanel() {
    console.log(this.userId);
    this.currentReplyMessageId = this.messageId;
    this.panelService.openReplyPanel();
    this.panelService.scroll = true;

    // Hier muss dann statt der message die ID des chats (replay chats) übergeben werden
    this.panelService.renderReplyPanel(
      this.message,
      this.name,
      this.time,
      this.imgUrl,
      this.isContact,
      this.numberOfAnswers,
      this.userId
    );
  }

  reactOnEmoji(
    emoji: string,
    user: string,
    message: string,
    channel: string,
    likes: { emoji: string; count: number; userIds: string[] }[]
  ) {
    console.log(
      'emoji',
      emoji,
      'user',
      user,
      'messageid',
      message,
      'channelid',
      channel,
      'likesarray',
      likes
    );
    const reactionsAsRecord: Record<
      string,
      { emoji: string; count: number; userIds: string[] }[]
    > = {
      [message]: likes,
    };

    this.emojiCounterService.handleEmojiLogic(
      emoji,
      message,
      user,
      channel,
      reactionsAsRecord
    );

    return;
  }

  onMouseLeave() {
    this.editMessagePopupOpen = false;
  }

  openProfilePopup() {
    let user = this.getUser(this.userId);

    this.popupService.contactProfileContent = user || new User();

    if (this.loggedInUser.id === this.userId)
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
    console.log(this.allUsers);
    console.log(userId);
    console.log(this.allUsers.find((user) => user.id === userId));
    return this.allUsers.find((user) => user.id === userId);
  }

  // Beispiel: Emoji setzen
  setEmoji(emoji: string) {
    this.emojiInput$.next(emoji);
  }

  sortedLikes() {
    return this.likes.sort((a, b) => b.count - a.count);
  }
}
