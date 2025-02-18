import { Injectable } from '@angular/core';
import { ReplyPanelComponent } from '../../main-page/reply-panel/reply-panel.component';

@Injectable({
  providedIn: 'root',
})
export class PanelService {
  isReplyPanelOpen = false;
  numberOfAnswers: number = 0;
  scroll: boolean = true;

  replyPanelComponent!: ReplyPanelComponent;

  isContact: boolean = false;
  messageId: string = '';

  openReplyPanel() {
    this.isReplyPanelOpen = true;
  }

  closeReplyPanel() {
    this.isReplyPanelOpen = false;
  }

  renderReplyPanel(
    isContact: boolean,
    numberOfAnswers: number,
    messageId: string
  ) {
    this.isContact = isContact;
    this.numberOfAnswers = numberOfAnswers;
    this.messageId = messageId;
  }
}
