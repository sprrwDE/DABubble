import { effect, Injectable } from '@angular/core';
import { ReplyPanelComponent } from '../../main-page/reply-panel/reply-panel.component';
import { GlobalVariablesService } from './global-variables.service';

@Injectable({
  providedIn: 'root',
})
export class PanelService {
  isReplyPanelOpen = false;
  isSidebarOpen = true;

  numberOfAnswers: number = 0;
  scroll: boolean = true;

  replyPanelComponent!: ReplyPanelComponent;

  isContact: boolean = false;
  messageId: string = '';

  isTablet = false;
  constructor(private globalVariablesService: GlobalVariablesService) {
    effect(() => {
      this.isTablet = this.globalVariablesService.isTablet();
    });
  }

  openReplyPanel() {
    this.isReplyPanelOpen = true;

    if (this.isTablet) {
      this.isSidebarOpen = false;
    }
  }

  openSidebar() {
    this.isSidebarOpen = true;

    if (this.isTablet) {
      this.isReplyPanelOpen = false;
    }
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
