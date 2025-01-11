import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-user-message',
  standalone: true,
  imports: [],
  templateUrl: './user-message.component.html',
  styleUrl: './user-message.component.scss',
})
export class UserMessageComponent {
  @Input() message: string = '';
  @Input() time: string = '';
  @Input() name: string = '';
  @Input() imgUrl: string = '';
}
