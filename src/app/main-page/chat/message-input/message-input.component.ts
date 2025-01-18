import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChannelService } from '../../../shared/services/channel.service';
import { Message } from '../../../shared/models/message.model';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../shared/services/user.service';

@Component({
  selector: 'app-message-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './message-input.component.html',
  styleUrl: './message-input.component.scss',
})
export class MessageInputComponent {
  @Input() isReplayInput: boolean = false;

  constructor(
    private channelService: ChannelService,
    private userService: UserService
  ) {}

  message: Message = new Message();

  sendMessage() {
    if (this.message.message.trim() === '') {
      console.log('Message is empty');
      return;
    }
    this.message.timestamp = new Date().getTime();
    this.message.userId = this.userService.loggedInUser.id;
    this.message.replies = [];

    this.channelService.sendMessage(this.message.toJSON());

    this.message.message = '';
  }
}
