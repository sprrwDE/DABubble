import { Component, Input, ViewChild, ElementRef, OnInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChannelService } from '../../../shared/services/channel.service';
import { Message } from '../../../shared/models/message.model';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../shared/services/user.service';
import { ChatComponent } from '../chat.component';
import { Reply } from '../../../shared/models/reply.model';
import { ReplyPanelComponent } from '../../reply-panel/reply-panel.component';

@Component({
  selector: 'app-message-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './message-input.component.html',
  styleUrl: './message-input.component.scss',
})
export class MessageInputComponent implements OnInit{
  @Input() isReplayInput: boolean = false;
  @Input() chatComponent!: ChatComponent;
  @Input() replyPanelComponent!: ReplyPanelComponent;

  @ViewChild('chatInput') chatInput!: ElementRef;
  @ViewChild('replyInput') replyInput!: ElementRef;

  public loggedInUser:any;

  constructor(
    private channelService: ChannelService,
    private userService: UserService
  ) {
 effect(() => {
      const user = this.userService.loggedInUser();
      this.loggedInUser = user
    });

  }

  ngOnInit(): void {
   
  }

  message: Message = new Message();
  reply: Reply = new Reply();



  get currentReplyMessageId(): string {
    return this.channelService.currentReplyMessageId;
  }

  sendMessage() {
    if (this.message.message.trim() === '') {
      console.log('Message is empty');
      return;
    }
    this.message.timestamp = new Date().getTime();
    this.message.userId = this.loggedInUser.id;
    this.message.replies = [];

    this.channelService.sendMessage(this.message.toJSON());

    this.message.message = '';

    this.chatComponent.scrollToBottom();

    console.log('Successfully sent message!!');
  }

  sendReply() {
    if (this.reply.message.trim() === '') {
      console.log('Message is empty');
      return;
    }
    this.reply.timestamp = new Date().getTime();
    this.reply.userId = this.loggedInUser.id;

    this.channelService.sendReply(
      this.currentReplyMessageId,
      this.reply.toJSON()
    );

    this.reply.message = '';

    this.replyPanelComponent.scrollToBottom();

    console.log('Successfully sent message!!');
  }
}
