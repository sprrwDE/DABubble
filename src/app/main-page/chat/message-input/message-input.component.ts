import { Component, Input, ViewChild, ElementRef, OnInit, effect } from '@angular/core';
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

@Component({
  selector: 'app-message-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './message-input.component.html',
  styleUrl: './message-input.component.scss',
})
export class MessageInputComponent implements OnInit {
  @Input() isReplayInput: boolean = false;
  @Input() chatComponent!: ChatComponent;
  @Input() replyPanelComponent!: ReplyPanelComponent;

  @ViewChild('chatInput') chatInput!: ElementRef;
  @ViewChild('replyInput') replyInput!: ElementRef;

  public loggedInUser: any;
  unsubLoggedInUser!: Subscription;

  constructor(
    private channelService: ChannelService,
    private userService: UserService
  ) {
    effect(() => {
      this.loggedInUser = this.userService.loggedInUser();
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
    // this.unsubLoggedInUser = this.userService.loggedInUser$.subscribe(
    //   (user: User) => {
    //     if (user) {
    //       this.message.userId = user.id;
    //     }
    //   }
    // );

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


    // this.unsubLoggedInUser = this.userService.loggedInUser$.subscribe(
    //   (user: User) => {
    //     if (user) {
    //       this.reply.userId = user.id;
    //     }
    //   }
    // );

    this.channelService.sendReply(
      this.currentReplyMessageId,
      this.reply.toJSON()
    );

    this.reply.message = '';

    this.replyPanelComponent.scrollToBottom();

    console.log('Successfully sent message!!');
  }

  ngOnDestroy() {
    if (this.unsubLoggedInUser) {
      this.unsubLoggedInUser.unsubscribe();
    }
  }
}
