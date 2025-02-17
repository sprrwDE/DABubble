import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, Input, Output, ViewChild, effect, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';
import { EmojiCounterService } from '../services/emoji-counter.service';
import { UserService } from '../services/user.service';
import { ChannelService } from '../services/channel.service';
import { Channel } from '../models/channel.model';

@Component({
  selector: 'app-emoji-picker',
  standalone: true,
  imports: [PickerModule, CommonModule],
  templateUrl: './emoji-picker.component.html',
  styleUrl: './emoji-picker.component.scss',
})
export class EmojiPickerComponent {
  loggedInUser: any;
  currentChannel: Channel = new Channel();
  @Input() emojiInput$: Subject<string> | undefined;
  @Input() messageId: string = '';
  @Input() channelId: string = '';
  @Input() replyId: string = '';
  @Input() messageLikes: Record<string, { emoji: string; count: number; userIds: string[] }[]> = {};
  @Input() replyLikes: Record<string, { emoji: string; count: number; userIds: string[] }[]> = {};
  @Input() isTextInput: boolean = false;
  @Input() isReply: boolean = false;
  @ViewChild('container') container: ElementRef<HTMLElement> | undefined;

  private _showEmojiPicker = false;

  @Input()
  set showEmojiPicker(value: boolean) {
    this._showEmojiPicker = value;
    this.isOpened = value;
  }
  
  get showEmojiPicker(): boolean {
    return this._showEmojiPicker;
  }

  @Output() showEmojiPickerChange = new EventEmitter<boolean>(); // 🔥 EventEmitter für die Synchronisation
  @Output() emojiSelectedEvent = new EventEmitter<string>();
  
  isOpened = false;

  constructor(
    private emojiCounterService: EmojiCounterService,
    private userService: UserService,
    private channelService: ChannelService
  ) {
    effect(() => {
      this.loggedInUser = this.userService.loggedInUser();
    });
    effect(() => {
      this.currentChannel = this.channelService.currentChannel();
    });
    effect(() => {
      this.currentChannel = this.channelService.currentChannel();
    });
    
  }

  emojiSelected(event: any) {
    if(!this.isTextInput) {
      this.emojiInput$?.next(event.emoji.native);
      const selectedEmoji = event.emoji.native;
      console.log('current Reply Likes', this.replyLikes, 'for', this.replyId, 'in', this.messageId)
      this.emojiCounterService.handleEmojiLogic(
        selectedEmoji,
        this.messageId,
        this.loggedInUser.id,
        this.currentChannel.id,
        this.messageLikes,
        this.isReply,
        this.replyId,
        this.replyLikes
      );
    } else {
      this.emojiInput$?.next(event.emoji.native);
      const selectedEmoji = event.emoji.native;
      console.log('input', selectedEmoji)
      this.emojiSelectedEvent.emit(selectedEmoji);
    }

  }

  eventHandler = (event: Event) => {
    if (
      this.isOpened &&
      this.container 
      && !this.container.nativeElement.contains(event.target as Node)
    ) {
      this.isOpened = false;
      console.log('Emoji Picker geschlossen');
    }
  };

/* toggleEmojiPicker() {
    this.isOpened = !this.isOpened;
    if (this.isOpened) {
      window.addEventListener('click', this.eventHandler);
    } else {
      window.removeEventListener('click', this.eventHandler);
    }
    // this.emojiCounterService.resetList()
  } */

 @HostListener('document:click', ['$event'])
    handleClickOutside(event: Event) {
      if (
        this.isOpened &&
        this.container &&
        !this.container.nativeElement.contains(event.target as Node)
      ) {
        this.isOpened = false;
        this._showEmojiPicker = false;
        this.showEmojiPickerChange.emit(false); // 🔥 Event auslösen, damit `UserMessageComponent` es mitbekommt
        console.log('Emoji Picker geschlossen');
      }
    } 
}
