import { CommonModule } from '@angular/common';
import {
  Component,
  ViewChild,
  ElementRef,
  AfterViewInit,
  EventEmitter,
  Output,
  Input,
} from '@angular/core';
import { UserMessageComponent } from './user-message/user-message.component';
import { MessageInputComponent } from './message-input/message-input.component';
import { PopupComponent } from '../../popup/popup.component';
import { PopupService } from '../../popup/popup.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    CommonModule,
    UserMessageComponent,
    MessageInputComponent,
    PopupComponent,
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
})
export class ChatComponent implements AfterViewInit {
  public channelDetailsPopupOpen: boolean = false;
  public channelDetailsPopupType: string = '';
  public channelDetailsPopupCorner: string = '';

  public memberListPopupOpen: boolean = false;
  public memberListPopupType: string = '';
  public memberListPopupCorner: string = '';

  constructor(public popupService: PopupService) {}

  openChannelDetailsPopup(type: string, corner: string) {
    this.channelDetailsPopupOpen = true;
    this.channelDetailsPopupType = type;
    this.channelDetailsPopupCorner = corner;
  }

  closeChannelDetailsPopup() {
    this.channelDetailsPopupOpen = false;
  }

  openMemberListPopup(
    type: string,
    corner: string,
    showAddMembersPopup: boolean = false
  ) {
    this.memberListPopupOpen = true;
    this.memberListPopupType = type;
    this.memberListPopupCorner = corner;
    this.popupService.showAddMembersPopup = showAddMembersPopup;
  }

  closeMemberListPopup() {
    this.memberListPopupOpen = false;
  }

  @ViewChild('chatContainer') private chatContainer!: ElementRef;

  ngAfterViewInit() {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      this.chatContainer.nativeElement.scrollTop =
        this.chatContainer.nativeElement.scrollHeight;
    } catch (err) {}
  }
}
