import { CommonModule } from '@angular/common';
import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { UserMessageComponent } from './user-message/user-message.component';
import { MessageInputComponent } from './message-input/message-input.component';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, UserMessageComponent, MessageInputComponent],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
})
export class ChatComponent implements AfterViewInit {
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
