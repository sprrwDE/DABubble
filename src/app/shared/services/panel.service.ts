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

  replyPanelComponent!: ReplyPanelComponent;

  openReplyPanel() {
    this.isReplyPanelOpen = true;
  }

  closeReplyPanel() {
    this.isReplyPanelOpen = false;
  }

  scrollToBottom() {
    this.replyPanelComponent.scrollToBottom();
  }

  renderReplyPanel(
    message: string,
    name: string,
    time: string,
    imgUrl: string,
    isContact: boolean,
    numberOfAnswers: number
  ) {
    this.message = message;
    this.name = name;
    this.time = time;
    this.imgUrl = imgUrl;
    this.isContact = isContact;
    this.numberOfAnswers = numberOfAnswers;
  }
}
