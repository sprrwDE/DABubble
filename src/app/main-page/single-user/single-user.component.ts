import { Component, Output, EventEmitter, Input } from '@angular/core';
import { User } from '../../shared/models/user.model';

@Component({
  selector: 'app-single-user',
  standalone: true,
  imports: [],
  templateUrl: './single-user.component.html',
  styleUrl: './single-user.component.scss'
})
export class SingleUserComponent {
  @Output() closeEvent = new EventEmitter<void>();
  @Input() userData!: User;


  closeDialog() {
    this.closeEvent.emit();
  }

  ngOnInit() {
    console.log('User Data:', this.userData);
  }

}
