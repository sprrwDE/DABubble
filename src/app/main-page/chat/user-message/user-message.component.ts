import { NgClass, NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { PanelService } from '../../../shared/services/panel.service';
import { PopupService } from '../../../popup/popup.service';

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

  editMessagePopupOpen: boolean = false;

  constructor(
    private panelService: PanelService,
    private popupService: PopupService
  ) {}

  get editingUserProfile() {
    return this.popupService.editingUserProfile;
  }

  set editingUserProfile(value: boolean) {
    this.popupService.editingUserProfile = value;
  }

  get openUserProfilePopup() {
    return this.popupService.openUserProfilePopup;
  }

  set openUserProfilePopup(value: boolean) {
    this.popupService.openUserProfilePopup = value;
  }

  openProfilePopup() {
    this.popupService.openUserProfilePopup = true;
    this.popupService.editingUserProfile = false;
  }

  toggleEditMessagePopup() {
    this.editMessagePopupOpen = !this.editMessagePopupOpen;
  }

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

  onMouseLeave() {
    this.editMessagePopupOpen = false;
  }
}
