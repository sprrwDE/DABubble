import { Injectable } from '@angular/core';
import { ReplyPanelComponent } from '../../main-page/reply-panel/reply-panel.component';

@Injectable({
  providedIn: 'root',
})
export class PanelService {
  isReplyPanelOpen = false;
  message: string = '';
  name: string = '';
  time: string = '';
  imgUrl: string = '';
  isContact: boolean = false;
  numberOfAnswers: number = 0;
  scroll: boolean = true;
  userId: string = '';
  messageId: string = ''

  replyPanelComponent!: ReplyPanelComponent;

  openReplyPanel() {
    this.isReplyPanelOpen = true;
  }

  closeReplyPanel() {
    this.isReplyPanelOpen = false;
  }

  renderReplyPanel(
    message: string,
    name: string,
    time: string,
    imgUrl: string,
    isContact: boolean,
    numberOfAnswers: number,
    userId: string,
    messageId: string
  ) {
    this.message = message;
    this.name = name;
    this.time = time;
    this.imgUrl = imgUrl;
    this.isContact = isContact;
    this.numberOfAnswers = numberOfAnswers;
    this.userId = userId;
    this.messageId = messageId
  }
}
