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
  public popupOpen: boolean = false;
  public popupType: string = '';
  public popupCorner: string = '';

  openPopup(type: string, corner: string) {
    this.popupOpen = true;
    this.popupType = type;
    this.popupCorner = corner;
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

  closePopup() {
    this.popupOpen = false;
  }
}
