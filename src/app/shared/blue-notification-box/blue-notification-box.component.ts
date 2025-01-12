import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-blue-notification-box',
  standalone: true,
  imports: [],
  templateUrl: './blue-notification-box.component.html',
  styleUrl: './blue-notification-box.component.scss'
})
export class BlueNotificationBoxComponent {
@Input() message: string = '';
@Input() visible: boolean = true;
}
