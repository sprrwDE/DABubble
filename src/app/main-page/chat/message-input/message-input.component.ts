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
import { DirectChatService } from '../../../shared/direct-chat.service';
import { DirectChat } from '../../../shared/models/direct-chat.model';

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
  @Input() isDirectChat: boolean = false;

  @ViewChild('chatInput') chatInput!: ElementRef;
  @ViewChild('replyInput') replyInput!: ElementRef;

  public loggedInUser: any;
  unsubLoggedInUser!: Subscription;

  currentDirectChat: DirectChat = new DirectChat();
  currentDirectChatUser: User = new User();

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
  }

  ngOnInit(): void {}

  message: Message = new Message();
  reply: Reply = new Reply();

  directChat: DirectChat = new DirectChat();

  get currentReplyMessageId(): string {
    return this.channelService.currentReplyMessageId;
  }

  async sendMessage() {
    if (this.message.message.trim() === '') {
      console.log('Message is empty');
      return;
    }
    this.message.timestamp = new Date().getTime();
    this.message.userId = this.loggedInUser.id;

    console.log(this.currentDirectChat);

    if (this.isDirectChat) {
      const isSelfChat = this.loggedInUser.id === this.currentDirectChatUser.id;
      const userIdCount = this.currentDirectChat.userIds.filter(
        (id) => id === this.loggedInUser.id
      ).length;

      if (
        (!isSelfChat &&
          (!this.currentDirectChat.userIds.includes(this.loggedInUser.id) ||
            !this.currentDirectChat.userIds.includes(
              this.currentDirectChatUser.id
            ))) ||
        (isSelfChat && userIdCount !== 2)
      ) {
        this.directChat.userIds = [
          this.loggedInUser.id,
          this.currentDirectChatUser.id,
        ];

        const chatId = await this.directChatService.addDirectChat(
          this.directChat.toJSON()
        );
        if (chatId) {
          this.directChat.id = chatId;
          this.directChatService.currentDirectChat.set(this.directChat);
          this.directChatService.currentDirectChatId = chatId;
        }
      }
      this.directChatService.sendMessage(this.message.toJSON());
    } else {
      this.channelService.sendMessage(this.message.toJSON());
    }

    this.message.message = '';
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

    console.log('Successfully sent message!!');
  }

  ngOnDestroy() {
    if (this.unsubLoggedInUser) {
      this.unsubLoggedInUser.unsubscribe();
    }
  }
}
