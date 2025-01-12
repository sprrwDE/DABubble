import { NgClass, NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { PanelService } from '../../../shared/services/panel.service';

@Component({
  selector: 'app-user-message',
  standalone: true,
  imports: [NgClass, NgIf],
  templateUrl: './user-message.component.html',
  styleUrl: './user-message.component.scss',
})
export class UserMessageComponent {
  @Input() message: string = '';
  @Input() time: string = '';
  @Input() name: string = '';
  @Input() imgUrl: string = '';
  @Input() isContact: boolean = false;
  @Input() isReplay: boolean = false;
  @Input() lastAnswerTime: string = '';
  @Input() numberOfAnswers: number = 0;
  @Input() likes: Array<string> = [];

  constructor(private panelService: PanelService) {}

  openReplyPanel() {
    this.panelService.openReplyPanel();

    // Hier muss dann statt der message die ID des chats (replay chats) übergeben werden
    this.panelService.renderReplyPanel(
      this.message,
      this.name,
      this.time,
      this.imgUrl,
      this.isContact,
      this.numberOfAnswers
    );
  }
}
