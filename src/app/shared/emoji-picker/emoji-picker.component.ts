import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, ViewChild, effect } from '@angular/core';
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
  isOpened = true;
  loggedInUser: any;
  currentChannel: Channel = new Channel();
  @Input() emojiInput$: Subject<string> | undefined;
  @Input() messageId: string = '';
  @Input() channelId: string = '';
  @ViewChild('container') container: ElementRef<HTMLElement> | undefined;

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
  }

  emojiSelected(event: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    this.emojiInput$?.next(event.emoji.native);
    const selectedEmoji = event.emoji.native;
    console.log('Selected Emoji:', selectedEmoji);
    console.log('Reply Message ID:', this.messageId);
    console.log('Channel ID:', this.channelId);
    this.emojiCounterService.addEmoji(
      selectedEmoji,
      this.messageId,
      this.loggedInUser.id,
      this.currentChannel.id
    );
  }

  eventHandler = (event: Event) => {
    if (
      this.isOpened &&
      this.container &&
      !this.container.nativeElement.contains(event.target as Node)
    ) {
      this.isOpened = false;
      console.log('Emoji Picker geschlossen');
    }
  };

  toggleEmojiPicker() {
    this.isOpened = !this.isOpened;
    if (this.isOpened) {
      window.addEventListener('click', this.eventHandler);
    } else {
      window.removeEventListener('click', this.eventHandler);
    }
    // this.emojiCounterService.resetList()
  }

  /*   ngOnDestroy() {
    this.emojiCounterService.resetList()
  } */
}
