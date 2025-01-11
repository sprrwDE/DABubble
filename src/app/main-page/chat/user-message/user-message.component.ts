import { NgClass, NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';

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
  @Input() isAnswer: boolean = false;
  @Input() lastAnswerTime: string = '';
  @Input() numberOfAnswers: number = 0;
  @Input() likes: Array<string> = [];
}
