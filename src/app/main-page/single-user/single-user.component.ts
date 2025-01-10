import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-single-user',
  standalone: true,
  imports: [],
  templateUrl: './single-user.component.html',
  styleUrl: './single-user.component.scss'
})
export class SingleUserComponent {
  @Output() closeEvent = new EventEmitter<void>();

  closeDialog() {
    this.closeEvent.emit();
  }

}
